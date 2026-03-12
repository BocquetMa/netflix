import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, ActivatedRoute } from '@angular/router';
import { ProfileService } from '../../services/profile';
import { UserProfile } from '../../models/user-profile';

@Component({
  selector: 'app-profile-select',
  imports: [CommonModule],
  templateUrl: './profile-select.html',
  styleUrl: './profile-select.scss',
})
export class ProfileSelect implements OnInit {
  profiles: UserProfile[] = [];
  private returnUrl = '/';

  constructor(
    private profileService: ProfileService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.profiles = this.profileService.getProfiles();
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/';
  }

  selectProfile(profile: UserProfile) {
    this.profileService.selectProfile(profile);
    this.router.navigate([this.returnUrl]);
  }

  manageProfiles() {
    this.router.navigate(['/profile']);
  }
}
