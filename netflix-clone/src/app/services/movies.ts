import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Movie } from '../models/movie';
import { Observable, of, forkJoin } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

const TMDB_TOKEN = 'eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiIwNzFkZGRkZGJiNTM4ODI4YWFhZjU3ZWUxMmIxMjhhZCIsIm5iZiI6MTc3MzIzNDE1OC4zMywic3ViIjoiNjliMTY3ZWU1N2Q2YWQ3YTI0MzcyYjViIiwic2NvcGVzIjpbImFwaV9yZWFkIl0sInZlcnNpb24iOjF9.BMxU9G5rV0oxFug9kAUIxijGaSy8stS_u0KTM0o3HkQ';

@Injectable({
  providedIn: 'root',
})
export class Movies {
  private baseUrl = 'https://api.themoviedb.org/3';
  private imgBase = 'https://image.tmdb.org/t/p';
  private lang = 'fr-FR';
  private headers = new HttpHeaders({ Authorization: `Bearer ${TMDB_TOKEN}` });

  // Cache mediaType per TMDB id to know which endpoint to call
  private typeCache = new Map<number, 'movie' | 'tv'>();

  // Genre name (French) → TMDB genre id
  private genreToId: { [key: string]: number } = {
    'Action': 28,
    'Comédie': 35,
    'Drame': 18,
    'Science-Fiction': 878,
    'Thriller': 53,
    'Horreur': 27,
    'Fantaisie': 14,
    'Aventure': 12,
    'Crime': 80,
    'Mystère': 9648,
    'Romance': 10749,
    'Animation': 16,
    'Historique': 36,
    'Famille': 10751,
    'Western': 37,
  };

  // TMDB genre id → French name
  private idToGenre: { [id: number]: string } = {
    28: 'Action',
    12: 'Aventure',
    16: 'Animation',
    35: 'Comédie',
    80: 'Crime',
    99: 'Documentaire',
    18: 'Drame',
    10751: 'Famille',
    14: 'Fantaisie',
    36: 'Historique',
    27: 'Horreur',
    10402: 'Musique',
    9648: 'Mystère',
    10749: 'Romance',
    878: 'Science-Fiction',
    10770: 'Téléfilm',
    53: 'Thriller',
    10752: 'Guerre',
    37: 'Western',
    10759: 'Action & Aventure',
    10762: 'Enfants',
    10763: 'Actualités',
    10764: 'Réalité',
    10765: 'Science-Fiction & Fantaisie',
    10766: 'Soap',
    10767: 'Talk',
    10768: 'Guerre & Politique',
  };

  constructor(private http: HttpClient) {}

  private get(path: string, params: Record<string, string> = {}): Observable<any> {
    const query = new URLSearchParams({ language: this.lang, ...params }).toString();
    return this.http.get(`${this.baseUrl}${path}?${query}`, { headers: this.headers });
  }

  private mapGenres(raw: any): string[] {
    if (raw.genres && Array.isArray(raw.genres)) {
      return raw.genres.map((g: any) => g.name);
    }
    if (raw.genre_ids && Array.isArray(raw.genre_ids)) {
      return raw.genre_ids.map((id: number) => this.idToGenre[id]).filter(Boolean);
    }
    return [];
  }

  private mapItem(raw: any): Movie {
    const isMovie = !!raw.title;
    const movie: Movie = {
      id: raw.id,
      title: raw.title || raw.name || '',
      description: raw.overview || '',
      imageUrl: raw.poster_path
        ? `${this.imgBase}/w500${raw.poster_path}`
        : 'https://via.placeholder.com/300x450?text=No+Image',
      backdropUrl: raw.backdrop_path
        ? `${this.imgBase}/original${raw.backdrop_path}`
        : '',
      year: new Date(raw.release_date || raw.first_air_date || '2000-01-01').getFullYear(),
      duration: raw.runtime
        ? `${Math.floor(raw.runtime / 60)}h ${raw.runtime % 60}min`
        : raw.number_of_episodes
        ? `${raw.number_of_episodes} épisodes`
        : '',
      genre: this.mapGenres(raw),
      rating: raw.vote_average ? Math.round(raw.vote_average * 10) / 10 : 0,
      type: isMovie ? 'movie' : 'series',
      mediaType: isMovie ? 'movie' : 'tv',
      releaseDate: raw.release_date || raw.first_air_date || undefined,
    };
    this.typeCache.set(movie.id, movie.mediaType!);
    return movie;
  }

  getAllMovies(): Observable<Movie[]> {
    return forkJoin([
      this.get('/trending/movie/week').pipe(map((r: any) => r.results.map((m: any) => this.mapItem(m)))),
      this.get('/trending/tv/week').pipe(map((r: any) => r.results.map((m: any) => this.mapItem(m)))),
    ]).pipe(
      map(([movies, tv]) => [...movies, ...tv]),
      catchError(() => of([]))
    );
  }

  getMovieById(id: number): Observable<Movie | undefined> {
    const mediaType = this.typeCache.get(id);

    if (mediaType) {
      return this.get(`/${mediaType}/${id}`).pipe(
        map((r: any) => this.mapItem(r)),
        catchError(() => of(undefined))
      );
    }

    // Unknown type: try movie first, fallback to tv
    return this.get(`/movie/${id}`).pipe(
      map((r: any) => this.mapItem(r)),
      catchError(() =>
        this.get(`/tv/${id}`).pipe(
          map((r: any) => this.mapItem(r)),
          catchError(() => of(undefined))
        )
      )
    );
  }

  getFeaturedMovie(): Observable<Movie | undefined> {
    return this.get('/trending/movie/week').pipe(
      map((r: any) => {
        if (!r.results || r.results.length === 0) return undefined;
        const movie = this.mapItem(r.results[0]);
        movie.featured = true;
        return movie;
      }),
      catchError(() => of(undefined))
    );
  }

  getMoviesByGenre(genre: string): Observable<Movie[]> {
    const genreId = this.genreToId[genre];
    if (!genreId) return of([]);

    return forkJoin([
      this.get('/discover/movie', { with_genres: String(genreId), sort_by: 'popularity.desc' }).pipe(
        map((r: any) => r.results.map((m: any) => this.mapItem(m))),
        catchError(() => of([]))
      ),
      this.get('/discover/tv', { with_genres: String(genreId), sort_by: 'popularity.desc' }).pipe(
        map((r: any) => r.results.map((m: any) => this.mapItem(m))),
        catchError(() => of([]))
      ),
    ]).pipe(
      map(([movies, tv]) => [...movies, ...tv].slice(0, 20))
    );
  }

  getMoviesByType(type: 'movie' | 'series'): Observable<Movie[]> {
    const endpoint = type === 'movie' ? '/movie/popular' : '/tv/popular';
    return this.get(endpoint).pipe(
      map((r: any) => r.results.map((m: any) => this.mapItem(m))),
      catchError(() => of([]))
    );
  }

  searchMovies(query: string): Observable<Movie[]> {
    if (!query.trim()) return of([]);
    return this.get('/search/multi', { query }).pipe(
      map((r: any) =>
        r.results
          .filter((m: any) => m.media_type === 'movie' || m.media_type === 'tv')
          .map((m: any) => this.mapItem(m))
      ),
      catchError(() => of([]))
    );
  }

  getMovieTrailer(id: number): Observable<string | null> {
    const mediaType = this.typeCache.get(id) || 'movie';
    return this.get(`/${mediaType}/${id}/videos`).pipe(
      map((r: any) => {
        const trailer = r.results?.find(
          (v: any) => v.type === 'Trailer' && v.site === 'YouTube'
        );
        return trailer ? trailer.key : null;
      }),
      catchError(() => of(null))
    );
  }

  getSimilarMovies(id: number): Observable<Movie[]> {
    const mediaType = this.typeCache.get(id) || 'movie';
    return this.get(`/${mediaType}/${id}/similar`).pipe(
      map((r: any) => r.results.map((m: any) => this.mapItem(m))),
      catchError(() => of([]))
    );
  }

  getUpcomingMovies(): Observable<Movie[]> {
    return this.get('/movie/upcoming').pipe(
      map((r: any) => r.results.map((m: any) => this.mapItem(m))),
      catchError(() => of([]))
    );
  }

  getUpcomingTV(): Observable<Movie[]> {
    return forkJoin([
      this.get('/tv/on_the_air').pipe(
        map((r: any) => r.results.map((m: any) => this.mapItem(m))),
        catchError(() => of([]))
      ),
      this.get('/tv/airing_today').pipe(
        map((r: any) => r.results.map((m: any) => this.mapItem(m))),
        catchError(() => of([]))
      ),
    ]).pipe(
      map(([onAir, today]) => {
        const seen = new Set<number>();
        return [...today, ...onAir].filter(m => {
          if (seen.has(m.id)) return false;
          seen.add(m.id);
          return true;
        });
      })
    );
  }

  getUpcoming(): Observable<Movie[]> {
    return forkJoin([
      this.getUpcomingMovies(),
      this.getUpcomingTV(),
    ]).pipe(
      map(([movies, tv]) => {
        const combined = [...movies, ...tv];
        combined.sort((a, b) => {
          const da = a.releaseDate ?? '';
          const db = b.releaseDate ?? '';
          return da.localeCompare(db);
        });
        return combined;
      })
    );
  }

  discover(filters: {
    query?: string;
    type?: 'all' | 'movie' | 'series';
    genre?: string;
    yearFrom?: number | null;
    yearTo?: number | null;
    ratingMin?: number;
    sortBy?: 'popularity' | 'rating' | 'date';
  }): Observable<Movie[]> {
    const sort: Record<string, string> = {
      popularity: 'popularity.desc',
      rating: 'vote_average.desc',
      date: 'primary_release_date.desc',
    };
    const sortParam = sort[filters.sortBy || 'popularity'];
    const genreId = filters.genre ? this.genreToId[filters.genre] : null;

    const buildParams = (mediaType: 'movie' | 'tv'): Record<string, string> => {
      const p: Record<string, string> = { sort_by: sortParam };
      if (genreId) p['with_genres'] = String(genreId);
      if (filters.ratingMin && filters.ratingMin > 0) p['vote_average.gte'] = String(filters.ratingMin);
      if (filters.yearFrom) {
        p[mediaType === 'movie' ? 'primary_release_date.gte' : 'first_air_date.gte'] = `${filters.yearFrom}-01-01`;
      }
      if (filters.yearTo) {
        p[mediaType === 'movie' ? 'primary_release_date.lte' : 'first_air_date.lte'] = `${filters.yearTo}-12-31`;
      }
      if (filters.ratingMin && filters.ratingMin > 0) p['vote_count.gte'] = '50';
      return p;
    };

    // With text query: use search endpoint then filter client-side
    if (filters.query?.trim()) {
      const searchType = filters.type === 'movie' ? 'movie' : filters.type === 'series' ? 'tv' : 'multi';
      return this.get(`/search/${searchType}`, { query: filters.query }).pipe(
        map((r: any) =>
          r.results
            .filter((m: any) => {
              if (searchType === 'multi') return m.media_type === 'movie' || m.media_type === 'tv';
              return true;
            })
            .map((m: any) => this.mapItem(m))
            .filter((m: Movie) => {
              if (genreId && !m.genre.includes(filters.genre!)) return false;
              if (filters.ratingMin && m.rating < filters.ratingMin) return false;
              if (filters.yearFrom && m.year < filters.yearFrom) return false;
              if (filters.yearTo && m.year > filters.yearTo) return false;
              return true;
            })
        ),
        catchError(() => of([]))
      );
    }

    // No query: use discover
    const type = filters.type || 'all';
    const movieReq = this.get('/discover/movie', buildParams('movie')).pipe(
      map((r: any) => r.results.map((m: any) => this.mapItem(m))),
      catchError(() => of([]))
    );
    const tvReq = this.get('/discover/tv', buildParams('tv')).pipe(
      map((r: any) => r.results.map((m: any) => this.mapItem(m))),
      catchError(() => of([]))
    );

    if (type === 'movie') return movieReq;
    if (type === 'series') return tvReq;
    return forkJoin([movieReq, tvReq]).pipe(
      map(([movies, tv]) => {
        const combined = [...movies, ...tv];
        combined.sort((a, b) => {
          if (filters.sortBy === 'rating') return b.rating - a.rating;
          if (filters.sortBy === 'date') return b.year - a.year;
          return 0;
        });
        return combined.slice(0, 40);
      })
    );
  }
}
