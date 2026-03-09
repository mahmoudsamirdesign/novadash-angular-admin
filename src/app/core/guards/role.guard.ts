import { inject } from '@angular/core';
import { CanMatchFn, Router } from '@angular/router';
import { UserRole } from '../models/auth.model';
import { AuthService } from '../services/auth.service';

export const roleGuard = (roles: UserRole[]): CanMatchFn => {
  return () => {
    const auth = inject(AuthService);
    const router = inject(Router);

    return auth.hasRole(roles) ? true : router.createUrlTree(['/auth/login']);
  };
};
