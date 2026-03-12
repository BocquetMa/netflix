import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { ProfileService } from './profile';

export interface ProgressEntry {
  percent: number;   // 0–100
  watchedAt: number; // timestamp ms
}

@Injectable({ providedIn: 'root' })
export class Progress {
  private readonly BASE_KEY = 'netstream_progress';
  private data$ = new BehaviorSubject<Record<number, ProgressEntry>>({});

  constructor(private profileService: ProfileService) {
    this.load();
    this.profileService.activeProfile$.subscribe(() => this.load());
  }

  private get storageKey(): string {
    const profileId = this.profileService.activeProfileValue?.id;
    return profileId ? `${this.BASE_KEY}_${profileId}` : this.BASE_KEY;
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(this.storageKey);
      this.data$.next(raw ? JSON.parse(raw) : {});
    } catch {
      this.data$.next({});
    }
  }

  set(movieId: number, percent: number) {
    const clamped = Math.min(100, Math.max(0, Math.round(percent * 10) / 10));
    const next = { ...this.data$.value, [movieId]: { percent: clamped, watchedAt: Date.now() } };
    this.data$.next(next);
    localStorage.setItem(this.storageKey, JSON.stringify(next));
  }

  get(movieId: number): number {
    return this.data$.value[movieId]?.percent ?? 0;
  }

  // Entries started but not finished (2%–97%)
  getInProgress(): (ProgressEntry & { movieId: number })[] {
    return Object.entries(this.data$.value)
      .filter(([, v]) => v.percent >= 2 && v.percent <= 97)
      .map(([id, v]) => ({ movieId: +id, ...v }))
      .sort((a, b) => b.watchedAt - a.watchedAt);
  }

  remove(movieId: number) {
    const next = { ...this.data$.value };
    delete next[movieId];
    this.data$.next(next);
    localStorage.setItem(this.storageKey, JSON.stringify(next));
  }

  get changes$() { return this.data$.asObservable(); }
}
