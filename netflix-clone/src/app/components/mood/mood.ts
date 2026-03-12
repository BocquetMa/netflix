import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Movies } from '../../services/movies';
import { Movie } from '../../models/movie';
import { Navbar } from '../navbar/navbar';
import { MovieCard } from '../movie-card/movie-card';

interface Mood {
  id: string;
  name: string;
  tagline: string;
  genres: string[];
  gradient: string;
  type: 'movie' | 'series' | 'all';
}

const MOODS: Mood[] = [
  { id: 'comedy',  name: "Je veux rire",       tagline: "Comédies et feel-good",          genres: ['Comédie'],                  gradient: 'linear-gradient(135deg, #f7971e, #ffd200)',        type: 'all' },
  { id: 'horror',  name: "Soirée frissons",    tagline: "Horreur et tension",             genres: ['Horreur', 'Thriller'],       gradient: 'linear-gradient(135deg, #1a1a2e, #8b0000)',        type: 'all' },
  { id: 'think',   name: "Je veux réfléchir",  tagline: "Drames et mystères",             genres: ['Drame', 'Mystère'],          gradient: 'linear-gradient(135deg, #141e30, #243b55)',        type: 'all' },
  { id: 'action',  name: "De l'action",        tagline: "Explosions et poursuites",       genres: ['Action', 'Aventure'],        gradient: 'linear-gradient(135deg, #e52d27, #b31217)',        type: 'all' },
  { id: 'romance', name: "Soirée romantique",  tagline: "Romantique et émouvant",         genres: ['Romance'],                   gradient: 'linear-gradient(135deg, #c94b4b, #4b134f)',        type: 'all' },
  { id: 'scifi',   name: "Dans l'espace",      tagline: "Espace, futur, technologie",     genres: ['Science-Fiction'],           gradient: 'linear-gradient(135deg, #0f2027, #2c5364)',        type: 'all' },
  { id: 'family',  name: "En famille",         tagline: "Pour toute la famille",          genres: ['Animation', 'Famille'],      gradient: 'linear-gradient(135deg, #11998e, #38ef7d)',        type: 'all' },
  { id: 'culture', name: "Culture & Art",      tagline: "Films d'auteur et histoire",     genres: ['Historique', 'Drame'],       gradient: 'linear-gradient(135deg, #4b6cb7, #182848)',        type: 'all' },
];

@Component({
  selector: 'app-mood',
  imports: [CommonModule, RouterLink, Navbar, MovieCard],
  templateUrl: './mood.html',
  styleUrl: './mood.scss',
})
export class MoodComponent implements OnInit {
  readonly moods = MOODS;
  selectedMood: Mood | null = null;
  movies: Movie[] = [];
  loading = false;

  // Shuffle for variety
  private shuffled: Movie[] = [];
  displayCount = 12;

  constructor(private moviesService: Movies) {}

  ngOnInit() {}

  selectMood(mood: Mood) {
    this.selectedMood = mood;
    this.movies = [];
    this.shuffled = [];
    this.displayCount = 12;
    this.loading = true;

    const requests = mood.genres.map(g =>
      this.moviesService.getMoviesByGenre(g).pipe(catchError(() => of([])))
    );

    forkJoin(requests).subscribe(results => {
      const combined = results.flat();
      // Deduplicate by id
      const seen = new Set<number>();
      const unique = combined.filter(m => {
        if (seen.has(m.id)) return false;
        seen.add(m.id);
        return true;
      });
      // Shuffle for variety
      this.shuffled = unique.sort(() => Math.random() - 0.5);
      this.movies = this.shuffled.slice(0, this.displayCount);
      this.loading = false;
    });
  }

  loadMore() {
    this.displayCount += 12;
    this.movies = this.shuffled.slice(0, this.displayCount);
  }

  changeMood() {
    this.selectedMood = null;
    this.movies = [];
  }

  get hasMore(): boolean {
    return this.movies.length < this.shuffled.length;
  }
}
