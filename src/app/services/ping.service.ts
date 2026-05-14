import { Injectable } from '@angular/core';
import { BehaviorSubject, Subject } from 'rxjs';

export interface PingResult {
  host: string;
  timestamp: Date;
  responseTime: number | null; // null means no response (timeout)
  success: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class PingService {
  private pingResults$ = new BehaviorSubject<PingResult[]>([]);
  private pingError$ = new Subject<{ host: string; error: string }>();
  private statsResetTimes = new Map<string, number>();

  private activeIntervals = new Map<string, ReturnType<typeof setInterval>>();

  getPingResults$() {
    return this.pingResults$.asObservable();
  }

  getPingError$() {
    return this.pingError$.asObservable();
  }

  startPinging(host: string, intervalMs: number): void {
    // Stop existing interval if any
    this.stopPinging(host);

    // Perform immediate ping
    this.performPing(host);

    // Set up interval
    const interval = setInterval(() => {
      this.performPing(host);
    }, intervalMs);

    this.activeIntervals.set(host, interval);
  }

  stopPinging(host: string): void {
    const interval = this.activeIntervals.get(host);
    if (interval) {
      clearInterval(interval);
      this.activeIntervals.delete(host);
    }
  }

  stopAllPinging(): void {
    this.activeIntervals.forEach(interval => clearInterval(interval));
    this.activeIntervals.clear();
  }

  private performPing(host: string): void {
    const startTime = performance.now();
    const timestamp = new Date();
    const TIMEOUT_MS = 5000;

    const url = host.includes('://') ? host : `https://${host}`;

    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), TIMEOUT_MS);

    fetch(url, { mode: 'no-cors', signal: controller.signal })
      .then(() => {
        clearTimeout(timeoutId);
        const elapsed = performance.now() - startTime;
        this.addPingResult({
          host, timestamp,
          responseTime: Math.round(elapsed),
          success: true,
        });
      })
      .catch(() => {
        clearTimeout(timeoutId);
        this.addPingResult({
          host, timestamp,
          responseTime: null,
          success: false,
        });
        this.pingError$.next({ host, error: 'Request failed or timed out' });
      });
  }

  private addPingResult(result: PingResult): void {
    const currentResults = this.pingResults$.value;
    const newResults = [...currentResults, result];
    this.pingResults$.next(newResults);
  }

  getResultsForHost(host: string): PingResult[] {
    return this.pingResults$.value.filter(r => r.host === host);
  }

  resetStatsForHost(host: string): void {
    this.statsResetTimes.set(host, Date.now());
  }

  getResetTime(host: string): number | null {
    return this.statsResetTimes.get(host) ?? null;
  }

  getResultsForStats(host: string): PingResult[] {
    const resetTime = this.statsResetTimes.get(host) || 0;
    return this.pingResults$.value.filter(r => r.host === host && r.timestamp.getTime() >= resetTime);
  }

  clearResultsForHost(host: string): void {
    const results = this.pingResults$.value.filter(r => r.host !== host);
    this.pingResults$.next(results);
  }

  clearAllResults(): void {
    this.pingResults$.next([]);
  }
}
