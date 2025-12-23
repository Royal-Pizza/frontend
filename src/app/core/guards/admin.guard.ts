import { inject } from '@angular/core';
import { Router, CanActivateFn } from '@angular/router';
import { AuthService } from '../auth/auth-service';

export const adminGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // On vérifie les deux signaux de ton AuthService
  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true; // Accès autorisé
  }

  // Si pas connecté ou pas admin, retour à l'accueil
  router.navigate(['/home']);
  return false;
};
