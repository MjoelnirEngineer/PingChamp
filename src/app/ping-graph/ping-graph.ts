import { Component, inject, OnInit, signal, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TargetService, PingTarget } from '../services/target.service';
import { PingService, PingResult } from '../services/ping.service';
import { TranslationService } from '../services/translation.service';
import { TranslatePipe } from '../pipes/translate.pipe';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

interface GraphData {
  target: PingTarget;
  labels: string[];
  data: (number | null)[];
  backgroundColors: string[];
  statsData: (number | null)[];
  resetIndex: number;
  failureIndices: number[];
}

@Component({
  selector: 'app-ping-graph',
  imports: [CommonModule, TranslatePipe],
  templateUrl: './ping-graph.html',
  styleUrl: './ping-graph.css',
})
export class PingGraph implements OnInit, OnDestroy {
  private targetService = inject(TargetService);
  private pingService = inject(PingService);
  protected tService = inject(TranslationService);
  private destroy$ = new Subject<void>();

  dragSrcIndex = signal<number | null>(null);
  dragOverIndex = signal<number | null>(null);
  maximizedTargetId = signal<string | null>(null);

  private dragAllowed = false;

  onHandleMouseDown(): void {
    this.dragAllowed = true;
  }

  onDragStart(index: number, event: DragEvent): void {
    if (!this.dragAllowed) {
      event.preventDefault();
      return;
    }
    this.dragAllowed = false;
    this.dragSrcIndex.set(index);
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
      event.dataTransfer.setData('text/plain', String(index));
    }
  }

  private getInsertIndex(event: DragEvent): number {
    const cards = (event.currentTarget as HTMLElement).querySelectorAll('.graph-card');
    const mouseX = event.clientX;
    const mouseY = event.clientY;
    let bestIdx = 0;
    let bestDist = Infinity;

    cards.forEach((card, i) => {
      const rect = card.getBoundingClientRect();
      const cx = rect.left + rect.width / 2;
      const cy = rect.top + rect.height / 2;
      const dist = Math.sqrt((mouseX - cx) ** 2 + (mouseY - cy) ** 2);
      if (dist < bestDist) {
        bestDist = dist;
        bestIdx = i;
      }
    });

    if (bestIdx === cards.length - 1) {
      const last = cards[bestIdx].getBoundingClientRect();
      const pastRight = mouseX > last.left + last.width;
      const pastBottom = mouseY > last.top + last.height;
      if (pastRight || pastBottom) bestIdx++;
    }

    return bestIdx;
  }

  onGridDragOver(event: DragEvent): void {
    event.preventDefault();
    if (event.dataTransfer) event.dataTransfer.dropEffect = 'move';
    this.dragOverIndex.set(this.getInsertIndex(event));
  }

  onGridDrop(event: DragEvent): void {
    event.preventDefault();
    const src = this.dragSrcIndex();
    const idx = this.getInsertIndex(event);
    this.clearDragStateBound();
    if (src !== null && src !== idx) {
      this.targetService.reorderTargets(src, idx);
    }
  }

  onDragLeave(): void {
    this.dragOverIndex.set(null);
  }

  onDragEnd(): void {
    this.clearDragStateBound();
  }

  private clearDragStateBound = (): void => {
    this.dragSrcIndex.set(null);
    this.dragOverIndex.set(null);
  };

  resetGraph(host: string): void {
    this.pingService.resetStatsForHost(host);
    this.updateGraphsData();
  }

  exportCSV(host: string): void {
    const allResults = this.pingResults();
    const results = allResults.filter(r => r.host === host);
    if (results.length === 0) return;

    const rows = [
      ['Timestamp', 'ResponseTime (ms)', 'Success'],
      ...results.map(r => [
        r.timestamp.toISOString(),
        r.responseTime ?? '',
        r.success ? 'Yes' : 'No'
      ])
    ];

    const csv = rows.map(r => r.join(',')).join('\r\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `${host}-ping-data.csv`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  toggleMaximize(targetId: string): void {
    this.maximizedTargetId.set(this.maximizedTargetId() === targetId ? null : targetId);
  }

  removeGraph(target: PingTarget): void {
    this.pingService.stopPinging(target.host);
    this.pingService.clearResultsForHost(target.host);
    this.targetService.removeTarget(target.id);
  }

  toggleTarget(target: PingTarget): void {
    if (target.isActive) {
      this.pingService.stopPinging(target.host);
    } else {
      this.pingService.startPinging(target.host, target.intervalMs);
    }
    this.targetService.setTargetActive(target.id, !target.isActive);
  }

  moveGraph(direction: number, targetId: string): void {
    const targets = this.targetService.getTargets();
    const idx = targets.findIndex(t => t.id === targetId);
    if (idx < 0) return;
    const newIdx = idx + direction;
    if (newIdx < 0 || newIdx >= targets.length) return;
    this.targetService.reorderTargets(idx, newIdx);
  }

  // Expose Math for template
  Math = Math;

  targets$ = this.targetService.getTargets$();
  graphsData = signal<GraphData[]>([]);
  pingResults = signal<PingResult[]>([]);

  ngOnInit(): void {
    this.destroy$.subscribe(() => document.removeEventListener('dragend', this.clearDragStateBound));
    document.addEventListener('dragend', this.clearDragStateBound);

    // Subscribe to ping results
    this.pingService.getPingResults$()
      .pipe(takeUntil(this.destroy$))
      .subscribe((results) => {
        console.log('Ping Results:', results);
        this.pingResults.set(results);
        this.updateGraphsData();
      });

    // Update graphs when targets change
    this.targets$
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        console.log('Targets:', this.targetService.getTargets());
        this.updateGraphsData();
      });
  }

  ngOnDestroy(): void {
    document.removeEventListener('dragend', this.clearDragStateBound);
    this.destroy$.next();
    this.destroy$.complete();
  }

  private updateGraphsData(): void {
    const targets = this.targetService.getTargets();
    const allResults = this.pingResults();

    const graphsData = targets.map((target) => {
      const results = allResults
        .filter((r) => r.host === target.host)
        .sort((a, b) => a.timestamp.getTime() - b.timestamp.getTime())
        .slice(-Math.max(1, Math.floor(target.maxTimeMs / 1000)));

      const labels = results.map((r) =>
        r.timestamp.toLocaleTimeString('en-US', { hour12: false })
      );

      const data = results.map((r) => r.responseTime);

      const statsResults = this.pingService.getResultsForStats(target.host);
      const statsData = statsResults.map((r) => r.responseTime);

      const backgroundColors = results.map((r) =>
        r.success
          ? `rgba(34, 197, 94, 0.6)` // Green for success
          : `rgba(239, 68, 68, 0.8)` // Red for failure
      );

      const failureIndices: number[] = [];
      results.forEach((r, i) => {
        if (!r.success) failureIndices.push(i);
      });

      const resetTime = this.pingService.getResetTime(target.host);
      let resetIndex = -1;
      if (resetTime !== null) {
        for (let i = 0; i < results.length; i++) {
          if (results[i].timestamp.getTime() >= resetTime) {
            resetIndex = i;
            break;
          }
        }
      }

      return {
        target,
        labels,
        data,
        backgroundColors,
        statsData,
        resetIndex,
        failureIndices,
      };
    });

    this.graphsData.set(graphsData);
  }

  getAverageTime(graphData: GraphData): number {
    const times = graphData.statsData.filter((d) => d !== null) as number[];
    return times.length > 0 ? Math.round(times.reduce((a, b) => a + b, 0) / times.length) : 0;
  }

  getMinTime(graphData: GraphData): number {
    const times = graphData.statsData.filter((d) => d !== null) as number[];
    return times.length > 0 ? Math.min(...times) : 0;
  }

  getMaxTime(graphData: GraphData): number {
    const times = graphData.data.filter((d) => d !== null) as number[];
    const max = times.length > 0 ? Math.max(...times) : 0;
    if (max <= 0) return 100;
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    return Math.ceil(max / magnitude) * magnitude;
  }

  getStatsMaxTime(graphData: GraphData): number {
    const times = graphData.statsData.filter((d) => d !== null) as number[];
    const max = times.length > 0 ? Math.max(...times) : 0;
    if (max <= 0) return 0;
    const magnitude = Math.pow(10, Math.floor(Math.log10(max)));
    return Math.ceil(max / magnitude) * magnitude;
  }

  getSuccessCount(graphData: GraphData): number {
    return graphData.statsData.filter((d) => d !== null).length;
  }

  getFailureCount(graphData: GraphData): number {
    return graphData.statsData.filter((d) => d === null).length;
  }

  getSuccessRate(graphData: GraphData): number {
    const total = graphData.statsData.length;
    if (total === 0) return 0;
    const successes = this.getSuccessCount(graphData);
    return Math.round((successes / total) * 100);
  }

  getYTicks(graphData: GraphData): number[] {
    const max = this.getMaxTime(graphData);
    const ticks: number[] = [];
    for (let i = 0; i <= 4; i++) {
      ticks.push(Math.round((max / 4) * (4 - i)));
    }
    return ticks;
  }

  getLinePath(graphData: GraphData, maxTime: number): string {
    const data = graphData.data;
    if (!data || data.every(d => d === null)) return "";
    
    let path = `M ${this.getPointX(0, data.length)},${this.getPointY(data[0], maxTime)} `;
    
    for (let i = 1; i < data.length; i++) {
      path += `L ${this.getPointX(i, data.length)},${this.getPointY(data[i], maxTime)} `;
    }
    return path;
  }

  getPointX(index: number, dataLength: number): string | number {
    const total = dataLength - 1;
    if (total <= 0) return "0";
    return (index / total) * 100;
  }

  getPointY(dataPoint: number | null, maxTime: number): string | number {
    if (dataPoint === null || maxTime === 0) return "100"; // At the bottom if no data or max time is zero
    // Normalization: (dataPoint / maxTime) * 100. Since CSS SVG Y coordinates are top-down (0 is top), 
    // we calculate the remaining distance from the bottom (100).
    const normalizedHeight = (dataPoint / maxTime) * 100;
    return (100 - normalizedHeight).toFixed(2);
  }
}

