import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Movies } from '../../services/movies';
import { ProfileService } from '../../services/profile';
import { Progress } from '../../services/progress';
import { ReviewService } from '../../services/review';
import { Movie } from '../../models/movie';
import { Navbar } from '../navbar/navbar';

interface GenreStat { name: string; count: number; percent: number; }
interface WatchedEntry { movie: Movie; percent: number; }

@Component({
  selector: 'app-stats',
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './stats.html',
  styleUrl: './stats.scss',
})
export class Stats implements OnInit {
  loading = true;

  // Watch stats
  totalWatched = 0;       // > 90%
  totalInProgress = 0;   // 2-90%
  totalMovies = 0;
  totalSeries = 0;
  estimatedHours = 0;
  recentlyWatched: WatchedEntry[] = [];

  // Genre stats
  genreStats: GenreStat[] = [];
  favoriteGenre = '';

  // Review stats
  totalReviews = 0;
  avgRatingGiven = 0;

  // List stat
  myListCount = 0;

  constructor(
    private moviesService: Movies,
    public profileService: ProfileService,
    private progressService: Progress,
    private reviewService: ReviewService
  ) {}

  ngOnInit() {
    const profileId = this.profileService.activeProfileValue?.id;
    const storageKey = profileId ? `netstream_progress_${profileId}` : 'netstream_progress';

    let allEntries: { movieId: number; percent: number; watchedAt: number }[] = [];
    try {
      const raw = localStorage.getItem(storageKey);
      if (raw) {
        const data = JSON.parse(raw) as Record<string, { percent: number; watchedAt: number }>;
        allEntries = Object.entries(data)
          .filter(([, v]) => v.percent >= 2)
          .map(([id, v]) => ({ movieId: +id, percent: v.percent, watchedAt: v.watchedAt }))
          .sort((a, b) => b.watchedAt - a.watchedAt);
      }
    } catch {}

    this.totalInProgress = allEntries.filter(e => e.percent < 90).length;
    this.totalWatched = allEntries.filter(e => e.percent >= 90).length;

    const myReviews = this.reviewService.getAllMyReviews();
    this.totalReviews = myReviews.length;
    this.avgRatingGiven = myReviews.length
      ? myReviews.reduce((s, r) => s + r.rating, 0) / myReviews.length
      : 0;

    this.myListCount = this.profileService.activeProfileValue?.myList.length ?? 0;

    if (allEntries.length === 0) {
      this.loading = false;
      return;
    }

    // Fetch movie details for all progress entries
    const top20 = allEntries.slice(0, 20); // limit API calls
    forkJoin(
      top20.map(e => this.moviesService.getMovieById(e.movieId).pipe(catchError(() => of(undefined))))
    ).subscribe(results => {
      const movies = results.filter(Boolean) as Movie[];

      // Map movies back with their progress
      this.recentlyWatched = top20
        .map(e => {
          const movie = movies.find(m => m.id === e.movieId);
          return movie ? { movie, percent: e.percent } : null;
        })
        .filter(Boolean)
        .slice(0, 6) as WatchedEntry[];

      // Genre stats from all fetched movies
      const genreCount: Record<string, number> = {};
      for (const movie of movies) {
        for (const g of movie.genre.slice(0, 2)) {
          genreCount[g] = (genreCount[g] ?? 0) + 1;
        }
      }

      this.totalMovies = movies.filter(m => m.type === 'movie').length;
      this.totalSeries = movies.filter(m => m.type === 'series').length;

      // Estimated hours: 1h30 per movie, 45min per episode unit
      this.estimatedHours = Math.round(
        (this.totalMovies * 1.5 + this.totalSeries * 0.75)
      );

      const sortedGenres = Object.entries(genreCount)
        .sort((a, b) => b[1] - a[1])
        .slice(0, 6);

      const maxCount = sortedGenres[0]?.[1] ?? 1;
      this.genreStats = sortedGenres.map(([name, count]) => ({
        name,
        count,
        percent: Math.round((count / maxCount) * 100)
      }));

      this.favoriteGenre = sortedGenres[0]?.[0] ?? '';

      this.loading = false;
    });
  }

  getStarsFilled(rating: number): boolean[] {
    return [1,2,3,4,5].map(s => s <= Math.round(rating));
  }
}
