import { inject, PLATFORM_ID } from '@angular/core'; // Ajoute PLATFORM_ID
import { isPlatformBrowser } from '@angular/common'; // Ajoute isPlatformBrowser
import { CanActivateFn, Router } from '@angular/router';
import { Auth, authState } from '@angular/fire/auth';
import { map, take } from 'rxjs';

export const authGuard: CanActivateFn = (route, state) => {
  const auth = inject(Auth);
  const router = inject(Router);
  const platformId = inject(PLATFORM_ID);

  // On valide directement si on est pas sur le navigateur (SSR qui n'a pas accès à Firebase Auth)
  if (!isPlatformBrowser(platformId)) {
    return true; 
  }

  return authState(auth).pipe(
    take(1),
    map(user => {
      if (user) {
        return true;
      } else {
        return router.parseUrl('/login');
      }
    })
  );
};