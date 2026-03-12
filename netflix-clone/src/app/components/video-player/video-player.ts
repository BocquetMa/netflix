import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { Movies } from '../../services/movies';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-video-player',
  imports: [CommonModule],
  templateUrl: './video-player.html',
  styleUrl: './video-player.scss',
})
export class VideoPlayer implements OnInit {
  movie?: Movie;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moviesService: Movies
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.moviesService.getMovieById(id).subscribe(movie => {
        this.movie = movie;
      });
    });
  }

  goBack() {
    this.router.navigate(['/movie', this.movie?.id]);
  }
}
