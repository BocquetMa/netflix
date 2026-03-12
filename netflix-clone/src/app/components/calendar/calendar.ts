import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Movies } from '../../services/movies';
import { Movie } from '../../models/movie';
import { Navbar } from '../navbar/navbar';

type Tab = 'week' | 'month' | 'all';

interface CalendarGroup {
  label: string;
  movies: Movie[];
}

@Component({
  selector: 'app-calendar',
  imports: [CommonModule, RouterLink, Navbar],
  templateUrl: './calendar.html',
  styleUrl: './calendar.scss',
})
export class Calendar implements OnInit {
  allMovies: Movie[] = [];
  groups: CalendarGroup[] = [];
  activeTab: Tab = 'week';
  loading = true;

  constructor(private moviesService: Movies) {}

  ngOnInit() {
    this.moviesService.getUpcoming().subscribe({
      next: (movies) => {
        this.allMovies = movies;
        this.loading = false;
        this.buildGroups();
      },
      error: () => { this.loading = false; }
    });
  }

  setTab(tab: Tab) {
    this.activeTab = tab;
    this.buildGroups();
  }

  private buildGroups() {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const endOfWeek = new Date(now); endOfWeek.setDate(now.getDate() + 7);
    const endOfMonth = new Date(now); endOfMonth.setDate(now.getDate() + 30);

    let filtered = this.allMovies.filter(m => {
      if (!m.releaseDate) return false;
      const d = new Date(m.releaseDate);
      if (this.activeTab === 'week') return d >= now && d < endOfWeek;
      if (this.activeTab === 'month') return d >= now && d < endOfMonth;
      return true;
    });

    // Group by date label
    const groupMap = new Map<string, Movie[]>();
    for (const movie of filtered) {
      const d = new Date(movie.releaseDate!);
      const label = this.dateLabel(d, now);
      if (!groupMap.has(label)) groupMap.set(label, []);
      groupMap.get(label)!.push(movie);
    }

    this.groups = Array.from(groupMap.entries()).map(([label, movies]) => ({ label, movies }));
  }

  private dateLabel(d: Date, today: Date): string {
    const diff = Math.floor((d.getTime() - today.getTime()) / 86400000);
    if (diff === 0) return "Aujourd'hui";
    if (diff === 1) return 'Demain';
    if (diff < 0 && diff >= -1) return 'Hier';
    if (diff < 7 && diff > 0) return d.toLocaleDateString('fr-FR', { weekday: 'long', day: 'numeric', month: 'long' });
    return d.toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }

  countForTab(tab: Tab): number {
    const now = new Date(); now.setHours(0,0,0,0);
    const endOfWeek = new Date(now); endOfWeek.setDate(now.getDate() + 7);
    const endOfMonth = new Date(now); endOfMonth.setDate(now.getDate() + 30);
    return this.allMovies.filter(m => {
      if (!m.releaseDate) return false;
      const d = new Date(m.releaseDate);
      if (tab === 'week') return d >= now && d < endOfWeek;
      if (tab === 'month') return d >= now && d < endOfMonth;
      return true;
    }).length;
  }

  daysUntil(releaseDate: string): number {
    const now = new Date(); now.setHours(0,0,0,0);
    const d = new Date(releaseDate);
    return Math.floor((d.getTime() - now.getTime()) / 86400000);
  }

  formatDate(releaseDate: string): string {
    return new Date(releaseDate).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', year: 'numeric' });
  }
}
