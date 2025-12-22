// src/app/core/auth/guest.guard.ts
import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth-service';

/**
 * Guard qui interdit l'accès aux utilisateurs CONNECTÉS.
 * Utile pour les pages Login et Signup.
 */
export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Si l'utilisateur est déjà connecté, on le renvoie à l'accueil
  if (authService.isLoggedIn()) {
    router.navigate(['/home']);
    return false;
  }

  // Sinon (visiteur anonyme), on laisse passer
  return true;
};