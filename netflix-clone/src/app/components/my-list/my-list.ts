import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Movies } from '../../services/movies';
import { Auth } from '../../services/auth';
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
  allMovies: Movie[] = [];

  constructor(
    private moviesService: Movies,
    private authService: Auth
  ) {}

  ngOnInit() {
    // Load all movies first
    this.moviesService.getAllMovies().subscribe(movies => {
      this.allMovies = movies;
      this.updateMyList();
    });

    // Subscribe to user changes to update the list in real-time
    this.authService.currentUser$.subscribe(() => {
      this.updateMyList();
    });
  }

  updateMyList() {
    const user = this.authService.currentUserValue;
    if (user && user.myList.length > 0) {
      this.myListMovies = this.allMovies.filter(movie => user.myList.includes(movie.id));
    } else {
      this.myListMovies = [];
    }
  }
}
