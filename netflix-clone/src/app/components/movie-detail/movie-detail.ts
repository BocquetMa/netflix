import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Movies } from '../../services/movies';
import { Auth } from '../../services/auth';
import { Movie } from '../../models/movie';
import { Navbar } from '../navbar/navbar';
import { MovieRow } from '../movie-row/movie-row';

@Component({
  selector: 'app-movie-detail',
  imports: [CommonModule, RouterLink, Navbar, MovieRow],
  templateUrl: './movie-detail.html',
  styleUrl: './movie-detail.scss',
})
export class MovieDetail implements OnInit {
  movie?: Movie;
  similarMovies: Movie[] = [];

  constructor(
    private route: ActivatedRoute,
    private moviesService: Movies,
    private authService: Auth
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.moviesService.getMovieById(id).subscribe(movie => {
        this.movie = movie;

        if (movie) {
          // Get similar movies from the same genre
          this.moviesService.getMoviesByGenre(movie.genre[0]).subscribe(movies => {
            this.similarMovies = movies.filter(m => m.id !== movie.id);
          });
        }
      });
    });
  }

  isInMyList(): boolean {
    return this.movie ? this.authService.isInMyList(this.movie.id) : false;
  }

  toggleMyList(): void {
    if (!this.movie) return;

    if (this.isInMyList()) {
      this.authService.removeFromMyList(this.movie.id);
    } else {
      this.authService.addToMyList(this.movie.id);
    }
  }
}
