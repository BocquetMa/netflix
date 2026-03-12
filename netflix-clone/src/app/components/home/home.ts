import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of, Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { Movies } from '../../services/movies';
import { Progress } from '../../services/progress';
import { Movie } from '../../models/movie';
import { MovieRow } from '../movie-row/movie-row';
import { MovieCard } from '../movie-card/movie-card';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, MovieRow, MovieCard, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit, OnDestroy {
  featuredMovie?: Movie;
  allMovies: Movie[] = [];
  actionMovies: Movie[] = [];
  comedyMovies: Movie[] = [];
  dramaMovies: Movie[] = [];
  sciFiMovies: Movie[] = [];
  series: Movie[] = [];
  continueMovies: { movie: Movie; percent: number }[] = [];

  private progressSub!: Subscription;

  constructor(
    private moviesService: Movies,
    private progressService: Progress
  ) {}

  ngOnInit() {
    // Continue watching — réactif aux changements de progression
    this.progressSub = this.progressService.changes$.pipe(
      switchMap(() => {
        const entries = this.progressService.getInProgress();
        if (!entries.length) return of([]);
        return forkJoin(
          entries.map(e => this.moviesService.getMovieById(e.movieId))
        ).pipe(
          switchMap(movies => of(
            movies
              .map((movie, i) => ({ movie, percent: entries[i].percent }))
              .filter(item => !!item.movie) as { movie: Movie; percent: number }[]
          ))
        );
      })
    ).subscribe(items => {
      this.continueMovies = items;
    });
    this.moviesService.getFeaturedMovie().subscribe(movie => {
      this.featuredMovie = movie;
    });

    this.moviesService.getAllMovies().subscribe(movies => {
      this.allMovies = movies;
    });

    this.moviesService.getMoviesByGenre('Action').subscribe(movies => {
      this.actionMovies = movies;
    });

    this.moviesService.getMoviesByGenre('Comédie').subscribe(movies => {
      this.comedyMovies = movies;
    });

    this.moviesService.getMoviesByGenre('Drame').subscribe(movies => {
      this.dramaMovies = movies;
    });

    this.moviesService.getMoviesByGenre('Science-Fiction').subscribe(movies => {
      this.sciFiMovies = movies;
    });

    this.moviesService.getMoviesByType('series').subscribe(movies => {
      this.series = movies;
    });
  }

  removeFromContinue(movieId: number) {
    this.progressService.remove(movieId);
  }

  ngOnDestroy() {
    this.progressSub?.unsubscribe();
  }
}
