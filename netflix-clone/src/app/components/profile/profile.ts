import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { ProfileService, AVATAR_SEEDS, avatarUrl } from '../../services/profile';
import { UserProfile } from '../../models/user-profile';
import { User } from '../../models/user';
import { Navbar } from '../navbar/navbar';

interface EditState {
  profileId: number | null; // null = new profile
  name: string;
  avatarSeed: string;
  isKids: boolean;
}

@Component({
  selector: 'app-profile',
  imports: [CommonModule, FormsModule, Navbar],
  templateUrl: './profile.html',
  styleUrl: './profile.scss',
})
export class Profile implements OnInit {
  currentUser: User | null = null;
  profiles: UserProfile[] = [];
  editState: EditState | null = null;
  readonly avatarSeeds = AVATAR_SEEDS;
  readonly avatarUrl = avatarUrl;

  constructor(
    private authService: Auth,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
      this.profiles = user?.profiles ?? [];
    });
  }

  startAdd() {
    this.editState = { profileId: null, name: '', avatarSeed: AVATAR_SEEDS[0], isKids: false };
  }

  startEdit(profile: UserProfile) {
    const seed = AVATAR_SEEDS.find(s => avatarUrl(s) === profile.avatar) ?? AVATAR_SEEDS[0];
    this.editState = { profileId: profile.id, name: profile.name, avatarSeed: seed, isKids: profile.isKids };
  }

  cancelEdit() {
    this.editState = null;
  }

  saveEdit() {
    if (!this.editState || !this.editState.name.trim()) return;
    const { profileId, name, avatarSeed, isKids } = this.editState;
    if (profileId === null) {
      this.profileService.createProfile(name.trim(), avatarSeed, isKids);
    } else {
      this.profileService.updateProfile(profileId, { name: name.trim(), avatar: avatarUrl(avatarSeed), isKids });
    }
    this.editState = null;
  }

  deleteProfile(profile: UserProfile) {
    if (this.profiles.length <= 1) return;
    this.profileService.deleteProfile(profile.id);
  }

  canDelete(): boolean {
    return this.profiles.length > 1;
  }

  canAdd(): boolean {
    return this.profileService.canAddProfile();
  }

  done() {
    this.router.navigate(['/select-profile']);
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}
