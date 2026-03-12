import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive, Router } from '@angular/router';
import { Auth } from '../../services/auth';
import { ProfileService } from '../../services/profile';
import { User } from '../../models/user';
import { UserProfile } from '../../models/user-profile';

@Component({
  selector: 'app-navbar',
  imports: [CommonModule, RouterLink, RouterLinkActive],
  templateUrl: './navbar.html',
  styleUrl: './navbar.scss',
})
export class Navbar implements OnInit {
  isScrolled = false;
  showProfileMenu = false;
  currentUser: User | null = null;
  activeProfile: UserProfile | null = null;

  constructor(
    private authService: Auth,
    private profileService: ProfileService,
    private router: Router
  ) {}

  ngOnInit() {
    window.addEventListener('scroll', () => {
      this.isScrolled = window.scrollY > 50;
    });

    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });

    this.profileService.activeProfile$.subscribe(profile => {
      this.activeProfile = profile;
    });

    // Close menu when clicking outside
    document.addEventListener('click', (event) => {
      const target = event.target as HTMLElement;
      if (!target.closest('.navbar__profile')) {
        this.showProfileMenu = false;
      }
    });
  }

  toggleProfileMenu() {
    this.showProfileMenu = !this.showProfileMenu;
  }

  switchProfile() {
    this.profileService.clearActiveProfile();
    this.showProfileMenu = false;
    this.router.navigate(['/select-profile']);
  }

  logout() {
    this.authService.logout();
    this.showProfileMenu = false;
    this.router.navigate(['/login']);
  }

  isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }
}
