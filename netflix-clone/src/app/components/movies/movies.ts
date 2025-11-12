import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movies as MoviesService } from '../../services/movies';
import { Movie } from '../../models/movie';
import { Navbar } from '../navbar/navbar';
import { MovieRow } from '../movie-row/movie-row';

@Component({
  selector: 'app-movies',
  imports: [CommonModule, Navbar, MovieRow],
  templateUrl: './movies.html',
  styleUrl: './movies.scss',
})
export class Movies implements OnInit {
  movies: Movie[] = [];

  constructor(private moviesService: MoviesService) {}

  ngOnInit() {
    this.moviesService.getMoviesByType('movie').subscribe(movies => {
      this.movies = movies;
    });
  }
}
