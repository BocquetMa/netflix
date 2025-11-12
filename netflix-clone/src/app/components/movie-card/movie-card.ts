import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movie } from '../../models/movie';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-movie-card',
  imports: [CommonModule, RouterLink],
  templateUrl: './movie-card.html',
  styleUrl: './movie-card.scss',
})
export class MovieCard {
  @Input() movie!: Movie;

  constructor(private authService: Auth) {}

  isInMyList(): boolean {
    return this.authService.isInMyList(this.movie.id);
  }

  toggleMyList(event: Event): void {
    event.preventDefault();
    event.stopPropagation();

    if (this.isInMyList()) {
      this.authService.removeFromMyList(this.movie.id);
    } else {
      this.authService.addToMyList(this.movie.id);
    }
  }
}
