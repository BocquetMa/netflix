import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movies } from '../../services/movies';
import { Movie } from '../../models/movie';
import { MovieRow } from '../movie-row/movie-row';
import { Navbar } from '../navbar/navbar';

@Component({
  selector: 'app-home',
  imports: [CommonModule, RouterLink, MovieRow, Navbar],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home implements OnInit {
  featuredMovie?: Movie;
  allMovies: Movie[] = [];
  actionMovies: Movie[] = [];
  comedyMovies: Movie[] = [];
  dramaMovies: Movie[] = [];
  sciFiMovies: Movie[] = [];
  series: Movie[] = [];

  constructor(private moviesService: Movies) {}

  ngOnInit() {
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
}
