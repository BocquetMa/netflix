import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Subscription } from 'rxjs';
import { Movie } from '../../models/movie';
import { ProfileService } from '../../services/profile';
import { Progress } from '../../services/progress';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard implements OnInit, OnDestroy {
  @Input() movie!: Movie;

  progress = 0;
  private sub!: Subscription;

  constructor(
    private profileService: ProfileService,
    private progressService: Progress
  ) {}

  ngOnInit() {
    this.sub = this.progressService.changes$.subscribe(() => {
      this.progress = this.progressService.get(this.movie.id);
    });
  }

  isInMyList(): boolean {
    return this.profileService.isInMyList(this.movie.id);
  }

  toggleMyList(event: Event): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.isInMyList()) {
      this.profileService.removeFromMyList(this.movie.id);
    } else {
      this.profileService.addToMyList(this.movie.id);
    }
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
