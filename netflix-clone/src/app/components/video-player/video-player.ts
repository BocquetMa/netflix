import { Component, OnInit, OnDestroy, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { Movies } from '../../services/movies';
import { Progress } from '../../services/progress';
import { Movie } from '../../models/movie';

// Simulated total duration: 6000 seconds (100 min)
// At 1%/sec real-time → full "movie" = 100 real seconds (for easy testing)
const VIRTUAL_DURATION = 6000; // seconds of fake movie
const TICK_MS = 1000;           // every real second
const PERCENT_PER_TICK = 1;    // 1% per second for demo

@Component({
  selector: 'app-video-player',
  imports: [CommonModule, FormsModule],
  templateUrl: './video-player.html',
  styleUrl: './video-player.scss',
})
export class VideoPlayer implements OnInit, OnDestroy {
  movie?: Movie;
  percent = 0;       // 0–100
  isPlaying = true;
  showControls = true;
  volume = 80;
  isMuted = false;

  private interval?: ReturnType<typeof setInterval>;
  private hideTimer?: ReturnType<typeof setTimeout>;
  private saveTimer?: ReturnType<typeof setInterval>;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private moviesService: Movies,
    private progressService: Progress
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      const id = +params['id'];
      this.moviesService.getMovieById(id).subscribe(movie => {
        this.movie = movie;
        if (!movie) return;
        // Start from saved progress
        const saved = this.progressService.get(id);
        this.percent = saved < 98 ? saved : 0;
        this.startPlayback();
      });
    });
  }

  // ── Playback ────────────────────────────────────────────────────────────────

  startPlayback() {
    this.isPlaying = true;
    this.interval = setInterval(() => {
      if (!this.isPlaying) return;
      this.percent = Math.min(100, this.percent + PERCENT_PER_TICK);
      if (this.percent >= 100) {
        this.percent = 100;
        this.stop();
        this.saveProgress();
      }
    }, TICK_MS);

    // Auto-save every 5 seconds
    this.saveTimer = setInterval(() => this.saveProgress(), 5000);
  }

  stop() {
    this.isPlaying = false;
    clearInterval(this.interval);
  }

  togglePlay() {
    if (this.isPlaying) {
      this.stop();
    } else {
      this.startPlayback();
    }
    this.resetHideTimer();
  }

  skip(deltaPct: number) {
    this.percent = Math.max(0, Math.min(100, this.percent + deltaPct));
    this.saveProgress();
    this.resetHideTimer();
  }

  seek(event: MouseEvent) {
    const bar = event.currentTarget as HTMLElement;
    const rect = bar.getBoundingClientRect();
    this.percent = Math.max(0, Math.min(100, ((event.clientX - rect.left) / rect.width) * 100));
    this.saveProgress();
    this.resetHideTimer();
  }

  toggleMute() {
    this.isMuted = !this.isMuted;
    this.resetHideTimer();
  }

  // ── Controls visibility ──────────────────────────────────────────────────────

  @HostListener('mousemove')
  onMouseMove() { this.resetHideTimer(); }

  private resetHideTimer() {
    this.showControls = true;
    clearTimeout(this.hideTimer);
    if (this.isPlaying) {
      this.hideTimer = setTimeout(() => { this.showControls = false; }, 3000);
    }
  }

  // ── Time helpers ─────────────────────────────────────────────────────────────

  get currentSeconds(): number { return (this.percent / 100) * VIRTUAL_DURATION; }
  get remainingSeconds(): number { return VIRTUAL_DURATION - this.currentSeconds; }

  formatTime(sec: number): string {
    const s = Math.floor(sec);
    const h = Math.floor(s / 3600);
    const m = Math.floor((s % 3600) / 60);
    const ss = s % 60;
    if (h > 0) return `${h}:${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
    return `${String(m).padStart(2, '0')}:${String(ss).padStart(2, '0')}`;
  }

  get currentTime(): string { return this.formatTime(this.currentSeconds); }
  get totalTime(): string { return this.formatTime(VIRTUAL_DURATION); }
  get remainingTime(): string { return '-' + this.formatTime(this.remainingSeconds); }

  // ── Navigation ───────────────────────────────────────────────────────────────

  goBack() {
    this.saveProgress();
    this.router.navigate(['/movie', this.movie?.id]);
  }

  @HostListener('document:keydown', ['$event'])
  onKey(e: KeyboardEvent) {
    if (e.code === 'Space') { e.preventDefault(); this.togglePlay(); }
    if (e.code === 'ArrowLeft') this.skip(-10 / VIRTUAL_DURATION * 100);
    if (e.code === 'ArrowRight') this.skip(10 / VIRTUAL_DURATION * 100);
    if (e.code === 'Escape') this.goBack();
  }

  private saveProgress() {
    if (this.movie) this.progressService.set(this.movie.id, this.percent);
  }

  ngOnDestroy() {
    this.saveProgress();
    clearInterval(this.interval);
    clearInterval(this.saveTimer);
    clearTimeout(this.hideTimer);
  }
}
