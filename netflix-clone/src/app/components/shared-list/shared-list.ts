import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { forkJoin } from 'rxjs';
import { Movies } from '../../services/movies';
import { Movie } from '../../models/movie';

@Component({
  selector: 'app-shared-list',
  imports: [CommonModule, RouterLink],
  templateUrl: './shared-list.html',
  styleUrl: './shared-list.scss',
})
export class SharedList implements OnInit {
  profileName = '';
  movies: Movie[] = [];
  loading = true;
  error = false;

  constructor(
    private route: ActivatedRoute,
    private moviesService: Movies
  ) {}

  ngOnInit() {
    const token = this.route.snapshot.paramMap.get('token') ?? '';
    try {
      const data = JSON.parse(decodeURIComponent(atob(token)));
      this.profileName = data.n ?? 'Profil';
      const ids: number[] = data.ids ?? [];
      if (ids.length === 0) {
        this.loading = false;
        return;
      }
      forkJoin(ids.map(id => this.moviesService.getMovieById(id))).subscribe({
        next: (results) => {
          this.movies = results.filter(Boolean) as Movie[];
          this.loading = false;
        },
        error: () => {
          this.error = true;
          this.loading = false;
        }
      });
    } catch {
      this.error = true;
      this.loading = false;
    }
  }
}
