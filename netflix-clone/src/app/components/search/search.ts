import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, ActivatedRoute, Router } from '@angular/router';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, switchMap } from 'rxjs/operators';
import { Movies } from '../../services/movies';
import { Movie } from '../../models/movie';
import { Navbar } from '../navbar/navbar';
import { MovieCard } from '../movie-card/movie-card';

@Component({
  selector: 'app-search',
  imports: [CommonModule, FormsModule, RouterLink, Navbar, MovieCard],
  templateUrl: './search.html',
  styleUrl: './search.scss',
})
export class Search implements OnInit, OnDestroy {
  query = '';
  type: 'all' | 'movie' | 'series' = 'all';
  genre = '';
  yearFrom: number | null = null;
  yearTo: number | null = null;
  ratingMin = 0;
  sortBy: 'popularity' | 'rating' | 'date' = 'popularity';

  results: Movie[] = [];
  trending: Movie[] = [];
  loading = false;
  searched = false;

  readonly genres = [
    'Action', 'Aventure', 'Animation', 'Comédie', 'Crime',
    'Drame', 'Famille', 'Fantaisie', 'Historique',
    'Horreur', 'Mystère', 'Romance', 'Science-Fiction', 'Thriller', 'Western',
  ];

  // Subject émet les filtres sérialisés pour éviter distinctUntilChanged sur void
  private search$ = new Subject<string>();
  private sub!: Subscription;

  constructor(
    private moviesService: Movies,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    // Charger les tendances pour l'état par défaut
    this.moviesService.getAllMovies().subscribe(movies => {
      this.trending = movies.slice(0, 20);
    });

    // Lire les query params initiaux
    this.route.queryParams.subscribe(params => {
      if (params['q']) this.query = params['q'];
      if (params['type']) this.type = params['type'];
      if (params['genre']) this.genre = params['genre'];
      if (params['yearFrom']) this.yearFrom = +params['yearFrom'];
      if (params['yearTo']) this.yearTo = +params['yearTo'];
      if (params['ratingMin']) this.ratingMin = +params['ratingMin'];
      if (params['sortBy']) this.sortBy = params['sortBy'];
    });

    this.sub = this.search$.pipe(
      debounceTime(350),
      switchMap(() => {
        this.loading = true;
        this.searched = true;
        this.syncUrl();
        return this.moviesService.discover({
          query: this.query,
          type: this.type,
          genre: this.genre || undefined,
          yearFrom: this.yearFrom,
          yearTo: this.yearTo,
          ratingMin: this.ratingMin,
          sortBy: this.sortBy,
        });
      })
    ).subscribe({
      next: (movies) => {
        this.results = movies;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    if (this.query || this.genre || this.yearFrom || this.yearTo || this.ratingMin > 0) {
      this.onFiltersChange();
    }
  }

  onFiltersChange() {
    // Sérialiser pour que chaque changement soit unique même si on revient à la même valeur
    this.search$.next(JSON.stringify({
      query: this.query, type: this.type, genre: this.genre,
      yearFrom: this.yearFrom, yearTo: this.yearTo,
      ratingMin: this.ratingMin, sortBy: this.sortBy,
      _t: Date.now(), // force toujours un nouveau emit
    }));
  }

  setType(t: 'all' | 'movie' | 'series') {
    this.type = t;
    this.onFiltersChange();
  }

  removeGenre() { this.genre = ''; this.onFiltersChange(); }
  removeYearFrom() { this.yearFrom = null; this.onFiltersChange(); }
  removeYearTo() { this.yearTo = null; this.onFiltersChange(); }
  removeRating() { this.ratingMin = 0; this.onFiltersChange(); }

  resetFilters() {
    this.type = 'all';
    this.genre = '';
    this.yearFrom = null;
    this.yearTo = null;
    this.ratingMin = 0;
    this.sortBy = 'popularity';
    this.onFiltersChange();
  }

  clearSearch() {
    this.query = '';
    this.searched = false;
    this.results = [];
    this.syncUrl();
  }

  get hasActiveFilters(): boolean {
    return this.type !== 'all' || !!this.genre || !!this.yearFrom ||
      !!this.yearTo || this.ratingMin > 0 || this.sortBy !== 'popularity';
  }

  get activeChips(): { label: string; remove: () => void }[] {
    const chips: { label: string; remove: () => void }[] = [];
    if (this.type !== 'all') chips.push({ label: this.type === 'movie' ? 'Films' : 'Séries', remove: () => this.setType('all') });
    if (this.genre) chips.push({ label: this.genre, remove: () => this.removeGenre() });
    if (this.yearFrom) chips.push({ label: `Depuis ${this.yearFrom}`, remove: () => this.removeYearFrom() });
    if (this.yearTo) chips.push({ label: `Jusqu'à ${this.yearTo}`, remove: () => this.removeYearTo() });
    if (this.ratingMin > 0) chips.push({ label: `★ ${this.ratingMin}+`, remove: () => this.removeRating() });
    return chips;
  }

  private syncUrl() {
    const params: any = {};
    if (this.query) params['q'] = this.query;
    if (this.type !== 'all') params['type'] = this.type;
    if (this.genre) params['genre'] = this.genre;
    if (this.yearFrom) params['yearFrom'] = this.yearFrom;
    if (this.yearTo) params['yearTo'] = this.yearTo;
    if (this.ratingMin > 0) params['ratingMin'] = this.ratingMin;
    if (this.sortBy !== 'popularity') params['sortBy'] = this.sortBy;
    this.router.navigate([], { queryParams: params, replaceUrl: true });
  }

  ngOnDestroy() {
    this.sub?.unsubscribe();
  }
}
