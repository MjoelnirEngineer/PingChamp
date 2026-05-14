import { Injectable, signal } from '@angular/core';

const STORAGE_KEY = 'pingchamp_theme';

export type ThemeMode = 'light' | 'dark' | 'system';

@Injectable({ providedIn: 'root' })
export class ThemeService {
  readonly mode = signal<ThemeMode>('system');
  readonly resolved = signal<'light' | 'dark'>('light');

  private mediaQuery: MediaQueryList;

  constructor() {
    this.mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    this.load();

    this.mediaQuery.addEventListener('change', () => {
      if (this.mode() === 'system') {
        this.apply(this.mediaQuery.matches ? 'dark' : 'light');
      }
    });
  }

  setMode(mode: ThemeMode): void {
    this.mode.set(mode);
    this.save();
    if (mode === 'system') {
      this.apply(this.mediaQuery.matches ? 'dark' : 'light');
    } else {
      this.apply(mode);
    }
  }

  cycleMode(): void {
    const next: ThemeMode[] = ['light', 'dark', 'system'];
    const idx = next.indexOf(this.mode());
    this.setMode(next[(idx + 1) % next.length]);
  }

  private apply(resolved: 'light' | 'dark'): void {
    this.resolved.set(resolved);
    document.documentElement.setAttribute('data-theme', resolved);
  }

  private save(): void {
    try { localStorage.setItem(STORAGE_KEY, this.mode()); } catch { }
  }

  private load(): void {
    try {
      const saved = localStorage.getItem(STORAGE_KEY) as ThemeMode | null;
      if (saved && ['light', 'dark', 'system'].includes(saved)) {
        this.mode.set(saved);
        if (saved === 'system') {
          this.apply(this.mediaQuery.matches ? 'dark' : 'light');
        } else {
          this.apply(saved);
        }
        return;
      }
    } catch { }
    this.mode.set('system');
    this.apply(this.mediaQuery.matches ? 'dark' : 'light');
  }
}
