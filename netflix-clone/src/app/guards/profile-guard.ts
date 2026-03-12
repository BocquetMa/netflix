import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { ProfileService } from '../services/profile';

export const profileGuard: CanActivateFn = (route, state) => {
  const profileService = inject(ProfileService);
  const router = inject(Router);

  if (profileService.hasActiveProfile()) {
    return true;
  }

  router.navigate(['/select-profile'], { queryParams: { returnUrl: state.url } });
  return false;
};
