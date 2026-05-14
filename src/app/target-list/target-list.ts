import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { TargetService, PingTarget } from '../services/target.service';
import { PingService } from '../services/ping.service';
import { TranslatePipe } from '../pipes/translate.pipe';

@Component({
  selector: 'app-target-list',
  imports: [CommonModule, FormsModule, TranslatePipe],
  templateUrl: './target-list.html',
  styleUrl: './target-list.css',
})
export class TargetList {
  private targetService = inject(TargetService);
  private pingService = inject(PingService);

  collapsed = signal(false);

  targets$ = this.targetService.getTargets$();
  newHost = signal('');
  newInterval = signal(1000);
  newMaxTime = signal(60000);

  addTarget(): void {
    const host = this.newHost().trim();
    if (host) {
      this.targetService.addTarget(host, this.newInterval(), this.newMaxTime());
      const targets = this.targetService.getTargets();
      const last = targets[targets.length - 1];
      if (last) {
        this.togglePinging(last);
      }
      this.newHost.set('');
      this.newInterval.set(1000);
      this.newMaxTime.set(60000);
    }
  }

  removeTarget(id: string): void {
    this.pingService.stopPinging(this.getTargetHost(id));
    this.pingService.clearResultsForHost(this.getTargetHost(id));
    this.targetService.removeTarget(id);
  }

  togglePinging(target: PingTarget): void {
    if (target.isActive) {
      this.pingService.stopPinging(target.host);
    } else {
      this.pingService.startPinging(target.host, target.intervalMs);
    }
    this.targetService.setTargetActive(target.id, !target.isActive);
  }

  updateInterval(id: string, intervalMs: number): void {
    const target = this.targetService.getTargets().find(t => t.id === id);
    if (target && target.isActive) {
      this.pingService.stopPinging(target.host);
      this.targetService.updateTarget(id, { intervalMs });
      this.pingService.startPinging(target.host, intervalMs);
    } else {
      this.targetService.updateTarget(id, { intervalMs });
    }
  }

  updateMaxTime(id: string, maxTimeMs: number): void {
    this.targetService.updateTarget(id, { maxTimeMs });
  }

  private getTargetHost(id: string): string {
    return this.targetService.getTargets().find(t => t.id === id)?.host || '';
  }
}
