import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Review } from '../models/review';
import { ProfileService } from './profile';

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly KEY = 'netstream_reviews';
  private reviews$ = new BehaviorSubject<Review[]>([]);

  constructor(private profileService: ProfileService) {
    this.load();
    // Reload on profile switch
    this.profileService.activeProfile$.subscribe(() => this.load());
  }

  private load(): void {
    try {
      const raw = localStorage.getItem(this.KEY);
      this.reviews$.next(raw ? JSON.parse(raw) : []);
    } catch {
      this.reviews$.next([]);
    }
  }

  private save(reviews: Review[]): void {
    localStorage.setItem(this.KEY, JSON.stringify(reviews));
    this.reviews$.next(reviews);
  }

  getReviewsForMovie(movieId: number): Review[] {
    return this.reviews$.value.filter(r => r.movieId === movieId)
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  getMyReviewForMovie(movieId: number): Review | null {
    const profileId = this.profileService.activeProfileValue?.id;
    if (!profileId) return null;
    return this.reviews$.value.find(r => r.movieId === movieId && r.profileId === profileId) ?? null;
  }

  getAverageRating(movieId: number): number {
    const reviews = this.getReviewsForMovie(movieId);
    if (!reviews.length) return 0;
    return reviews.reduce((sum, r) => sum + r.rating, 0) / reviews.length;
  }

  addOrUpdateReview(movieId: number, rating: number, comment: string): void {
    const profile = this.profileService.activeProfileValue;
    if (!profile) return;
    const id = `${profile.id}_${movieId}`;
    const existing = this.reviews$.value.find(r => r.id === id);
    const review: Review = {
      id,
      profileId: profile.id,
      profileName: profile.name,
      profileAvatar: profile.avatar,
      movieId,
      rating,
      comment: comment.trim(),
      createdAt: existing?.createdAt ?? Date.now(),
    };
    const others = this.reviews$.value.filter(r => r.id !== id);
    this.save([review, ...others]);
  }

  deleteReview(movieId: number): void {
    const profileId = this.profileService.activeProfileValue?.id;
    if (!profileId) return;
    const id = `${profileId}_${movieId}`;
    this.save(this.reviews$.value.filter(r => r.id !== id));
  }

  getAllMyReviews(): Review[] {
    const profileId = this.profileService.activeProfileValue?.id;
    if (!profileId) return [];
    return this.reviews$.value.filter(r => r.profileId === profileId);
  }

  get changes$() { return this.reviews$.asObservable(); }
}
