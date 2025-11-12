import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movies } from '../../services/movies';
import { Movie } from '../../models/movie';
import { Navbar } from '../navbar/navbar';
import { MovieRow } from '../movie-row/movie-row';

@Component({
  selector: 'app-series',
  imports: [CommonModule, Navbar, MovieRow],
  templateUrl: './series.html',
  styleUrl: './series.scss',
})
export class Series implements OnInit {
  series: Movie[] = [];

  constructor(private moviesService: Movies) {}

  ngOnInit() {
    this.moviesService.getMoviesByType('series').subscribe(series => {
      this.series = series;
    });
  }
}
