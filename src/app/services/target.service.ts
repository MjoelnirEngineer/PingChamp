import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

const STORAGE_KEY = 'pingchamp_targets';

export interface PingTarget {
  id: string;
  host: string;
  intervalMs: number;
  maxTimeMs: number;
  isActive: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class TargetService {
  private targets$ = new BehaviorSubject<PingTarget[]>([]);
  private nextId = 1;

  constructor() {
    this.targets$.subscribe(v => { if (v.length > 0) this.saveToStorage(); });
  }

  private saveToStorage(): void {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.targets$.value));
    } catch { }
  }

  clearStorage(): void {
    try { localStorage.removeItem(STORAGE_KEY); } catch { }
  }

  loadFromStorage(): PingTarget[] | null {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      if (saved) {
        const targets: PingTarget[] = JSON.parse(saved);
        return targets;
      }
    } catch { }
    return null;
  }

  getTargets$() {
    return this.targets$.asObservable();
  }

  getTargets(): PingTarget[] {
    return this.targets$.value;
  }

  addTarget(host: string, intervalMs: number = 5000, maxTimeMs: number = 300000): void {
    const target: PingTarget = {
      id: `target-${this.nextId++}`,
      host,
      intervalMs,
      maxTimeMs,
      isActive: false
    };
    const currentTargets = this.targets$.value;
    this.targets$.next([...currentTargets, target]);
  }

  removeTarget(id: string): void {
    const targets = this.targets$.value.filter(t => t.id !== id);
    this.targets$.next(targets);
  }

  updateTarget(id: string, updates: Partial<PingTarget>): void {
    const targets = this.targets$.value.map(t =>
      t.id === id ? { ...t, ...updates } : t
    );
    this.targets$.next(targets);
  }

  setTargetActive(id: string, isActive: boolean): void {
    this.updateTarget(id, { isActive });
  }

  setAllTargetsInactive(): void {
    const targets = this.targets$.value.map(t => ({ ...t, isActive: false }));
    this.targets$.next(targets);
  }

  setTargets(targets: PingTarget[]): void {
    this.targets$.next(targets);
    // Update nextId based on existing IDs
    const maxId = Math.max(
      0,
      ...targets.map(t => {
        const match = t.id.match(/target-(\d+)/);
        return match ? parseInt(match[1], 10) : 0;
      })
    );
    this.nextId = maxId + 1;
  }

  reorderTargets(fromIndex: number, toIndex: number): void {
    const targets = [...this.targets$.value];
    const [removed] = targets.splice(fromIndex, 1);
    targets.splice(toIndex, 0, removed);
    this.targets$.next(targets);
  }

  clear(): void {
    this.targets$.next([]);
    this.clearStorage();
    this.nextId = 1;
  }
}
