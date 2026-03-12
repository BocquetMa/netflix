import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserProfile } from '../models/user-profile';
import { Auth } from './auth';

export const AVATAR_SEEDS = [
  'Felix', 'Annie', 'Aneka', 'Garfield', 'Jasmine', 'Jocelyn',
  'Kira', 'Liam', 'Luna', 'Max', 'Mia', 'Milo',
  'Oliver', 'Sophie', 'Zoey', 'Aaron', 'Abby', 'Aiden'
];

export function avatarUrl(seed: string): string {
  return `https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}`;
}

@Injectable({ providedIn: 'root' })
export class ProfileService {
  private readonly SESSION_KEY = 'netstream_active_profile';

  private activeProfileSubject: BehaviorSubject<UserProfile | null>;
  public activeProfile$: Observable<UserProfile | null>;

  constructor(private authService: Auth) {
    const stored = sessionStorage.getItem(this.SESSION_KEY);
    this.activeProfileSubject = new BehaviorSubject<UserProfile | null>(
      stored ? JSON.parse(stored) : null
    );
    this.activeProfile$ = this.activeProfileSubject.asObservable();

    // Clear active profile on logout
    this.authService.currentUser$.subscribe(user => {
      if (!user) this.clearActiveProfile();
    });
  }

  get activeProfileValue(): UserProfile | null {
    return this.activeProfileSubject.value;
  }

  hasActiveProfile(): boolean {
    return this.activeProfileValue !== null;
  }

  selectProfile(profile: UserProfile): void {
    sessionStorage.setItem(this.SESSION_KEY, JSON.stringify(profile));
    this.activeProfileSubject.next(profile);
  }

  clearActiveProfile(): void {
    sessionStorage.removeItem(this.SESSION_KEY);
    this.activeProfileSubject.next(null);
  }

  getProfiles(): UserProfile[] {
    return this.authService.currentUserValue?.profiles ?? [];
  }

  canAddProfile(): boolean {
    return this.getProfiles().length < 5;
  }

  createProfile(name: string, avatarSeed: string, isKids = false): void {
    const user = this.authService.currentUserValue;
    if (!user || !this.canAddProfile()) return;
    const maxId = user.profiles.reduce((m, p) => Math.max(m, p.id), 0);
    const newProfile: UserProfile = {
      id: maxId + 1,
      name,
      avatar: avatarUrl(avatarSeed),
      myList: [],
      isKids
    };
    this.authService.updateUser({ ...user, profiles: [...user.profiles, newProfile] });
  }

  updateProfile(profileId: number, changes: Partial<Pick<UserProfile, 'name' | 'avatar' | 'isKids'>>): void {
    const user = this.authService.currentUserValue;
    if (!user) return;
    const profiles = user.profiles.map(p => p.id === profileId ? { ...p, ...changes } : p);
    this.authService.updateUser({ ...user, profiles });
    if (this.activeProfileValue?.id === profileId) {
      this.selectProfile(profiles.find(p => p.id === profileId)!);
    }
  }

  deleteProfile(profileId: number): void {
    const user = this.authService.currentUserValue;
    if (!user || user.profiles.length <= 1) return;
    const profiles = user.profiles.filter(p => p.id !== profileId);
    this.authService.updateUser({ ...user, profiles });
    if (this.activeProfileValue?.id === profileId) this.clearActiveProfile();
  }

  addToMyList(movieId: number): void {
    const profile = this.activeProfileValue;
    const user = this.authService.currentUserValue;
    if (!profile || !user || profile.myList.includes(movieId)) return;
    const profiles = user.profiles.map(p =>
      p.id === profile.id ? { ...p, myList: [...p.myList, movieId] } : p
    );
    this.authService.updateUser({ ...user, profiles });
    this.selectProfile(profiles.find(p => p.id === profile.id)!);
  }

  removeFromMyList(movieId: number): void {
    const profile = this.activeProfileValue;
    const user = this.authService.currentUserValue;
    if (!profile || !user) return;
    const profiles = user.profiles.map(p =>
      p.id === profile.id ? { ...p, myList: p.myList.filter(id => id !== movieId) } : p
    );
    this.authService.updateUser({ ...user, profiles });
    this.selectProfile(profiles.find(p => p.id === profile.id)!);
  }

  isInMyList(movieId: number): boolean {
    return this.activeProfileValue?.myList.includes(movieId) ?? false;
  }
}
