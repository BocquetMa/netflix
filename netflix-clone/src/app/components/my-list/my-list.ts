import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { forkJoin } from 'rxjs';
import { Movies } from '../../services/movies';
import { ProfileService } from '../../services/profile';
import { Movie } from '../../models/movie';
import { Navbar } from '../navbar/navbar';
import { MovieRow } from '../movie-row/movie-row';

@Component({
  selector: 'app-my-list',
  imports: [CommonModule, Navbar, MovieRow],
  templateUrl: './my-list.html',
  styleUrl: './my-list.scss',
})
export class MyList implements OnInit {
  myListMovies: Movie[] = [];
  loading = false;
  shareLink: string | null = null;
  copied = false;

  constructor(
    private moviesService: Movies,
    private profileService: ProfileService
  ) {}

  ngOnInit() {
    this.profileService.activeProfile$.subscribe(() => {
      this.loadMyList();
    });
  }

  loadMyList() {
    const profile = this.profileService.activeProfileValue;
    if (!profile || profile.myList.length === 0) {
      this.myListMovies = [];
      return;
    }
    this.loading = true;
    forkJoin(profile.myList.map(id => this.moviesService.getMovieById(id))).subscribe({
      next: (movies) => {
        this.myListMovies = movies.filter(Boolean) as Movie[];
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  shareList() {
    const profile = this.profileService.activeProfileValue;
    if (!profile || profile.myList.length === 0) return;
    const data = { n: profile.name, ids: profile.myList };
    const token = btoa(encodeURIComponent(JSON.stringify(data)));
    this.shareLink = `${window.location.origin}/shared-list/${token}`;
    navigator.clipboard.writeText(this.shareLink).then(() => {
      this.copied = true;
      setTimeout(() => this.copied = false, 3000);
    }).catch(() => {});
  }

  closeShare() {
    this.shareLink = null;
  }
}
