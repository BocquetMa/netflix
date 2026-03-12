import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { Movies } from '../../services/movies';
import { ProfileService } from '../../services/profile';
import { Progress } from '../../services/progress';
import { ReviewService } from '../../services/review';
import { Movie } from '../../models/movie';
import { Review } from '../../models/review';
import { Navbar } from '../navbar/navbar';
import { MovieRow } from '../movie-row/movie-row';

@Component({
  selector: 'app-movie-detail',
  imports: [CommonModule, FormsModule, RouterLink, Navbar, MovieRow],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss',
})
export class MovieDetail implements OnInit, OnDestroy {
  movie?: Movie;
  similarMovies: Movie[] = [];
  trailerKey: string | null = null;
  loading = true;
  showTrailer = false;

  // Reviews
  reviews: Review[] = [];
  myReview: Review | null = null;
  averageRating = 0;
  reviewCount = 0;
  // Form state
  draftRating = 0;
  hoveredStar = 0;
  draftComment = '';
  showReviewForm = false;
  reviewSubmitted = false;

  // Trailer progress tracking
  private trailerInterval?: ReturnType<typeof setInterval>;
  private trailerSeconds = 0;
  private readonly TRAILER_DURATION = 150;

  constructor(
    private route: ActivatedRoute,
    private moviesService: Movies,
    public profileService: ProfileService,
    private progressService: Progress,
    private reviewService: ReviewService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.loading = true;
      this.trailerKey = null;
      this.showTrailer = false;
      this.resetReviewForm();

      this.moviesService.getMovieById(id).subscribe(movie => {
        this.movie = movie;
        this.loading = false;
        if (movie) {
          this.loadReviews(movie.id);
          this.moviesService.getSimilarMovies(id).subscribe(movies => {
            this.similarMovies = movies;
          });
          this.moviesService.getMovieTrailer(id).subscribe(key => {
            this.trailerKey = key;
          });
        }
      });
    });

    this.reviewService.changes$.subscribe(() => {
      if (this.movie) this.loadReviews(this.movie.id);
    });
  }

  private loadReviews(movieId: number): void {
    this.reviews = this.reviewService.getReviewsForMovie(movieId);
    this.myReview = this.reviewService.getMyReviewForMovie(movieId);
    this.averageRating = this.reviewService.getAverageRating(movieId);
    this.reviewCount = this.reviews.length;
    if (this.myReview) {
      this.draftRating = this.myReview.rating;
      this.draftComment = this.myReview.comment;
    }
  }

  private resetReviewForm(): void {
    this.draftRating = 0;
    this.hoveredStar = 0;
    this.draftComment = '';
    this.showReviewForm = false;
    this.reviewSubmitted = false;
    this.reviews = [];
    this.myReview = null;
    this.averageRating = 0;
    this.reviewCount = 0;
  }

  openReviewForm(): void {
    this.showReviewForm = true;
    if (this.myReview) {
      this.draftRating = this.myReview.rating;
      this.draftComment = this.myReview.comment;
    }
  }

  submitReview(): void {
    if (!this.movie || this.draftRating === 0) return;
    this.reviewService.addOrUpdateReview(this.movie.id, this.draftRating, this.draftComment);
    this.showReviewForm = false;
    this.reviewSubmitted = true;
    setTimeout(() => this.reviewSubmitted = false, 3000);
  }

  deleteMyReview(): void {
    if (!this.movie) return;
    this.reviewService.deleteReview(this.movie.id);
    this.draftRating = 0;
    this.draftComment = '';
  }

  setHoveredStar(star: number): void { this.hoveredStar = star; }
  clearHoveredStar(): void { this.hoveredStar = 0; }
  setDraftRating(star: number): void { this.draftRating = star; }

  getStarClass(star: number): string {
    const active = this.hoveredStar ? star <= this.hoveredStar : star <= this.draftRating;
    return active ? 'star active' : 'star';
  }

  getDisplayStars(rating: number): boolean[] {
    return [1,2,3,4,5].map(s => s <= Math.round(rating));
  }

  isInMyList(): boolean {
    return this.movie ? this.profileService.isInMyList(this.movie.id) : false;
  }

  toggleMyList(): void {
    if (!this.movie) return;
    if (this.isInMyList()) {
      this.profileService.removeFromMyList(this.movie.id);
    } else {
      this.profileService.addToMyList(this.movie.id);
    }
  }

  get movieProgress(): number {
    return this.movie ? this.progressService.get(this.movie.id) : 0;
  }

  onTrailerToggle(open: boolean) {
    this.showTrailer = open;
    if (open) {
      if (this.movie) {
        const saved = this.progressService.get(this.movie.id);
        this.trailerSeconds = (saved / 100) * this.TRAILER_DURATION;
      }
      this.trailerInterval = setInterval(() => {
        this.trailerSeconds = Math.min(this.trailerSeconds + 1, this.TRAILER_DURATION);
        if (this.movie) {
          const pct = (this.trailerSeconds / this.TRAILER_DURATION) * 100;
          this.progressService.set(this.movie.id, pct);
        }
      }, 1000);
    } else {
      clearInterval(this.trailerInterval);
    }
  }

  @HostListener('document:keydown.escape')
  onEscape() {
    if (this.showTrailer) this.onTrailerToggle(false);
  }

  ngOnDestroy() {
    clearInterval(this.trailerInterval);
    this.showTrailer = false;
  }

  get trailerUrl(): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl(
      `https://www.youtube.com/embed/${this.trailerKey}?autoplay=1&rel=0`
    );
  }
}
