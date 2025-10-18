import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { JwtService } from '../services/jwt.service';
import { AuthService } from '../services/auth.service';
import { catchError, from, map, of, switchMap } from 'rxjs';
import { LoginResponseDto } from '../dtos/login-response.dto';

export const authGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const jwtService = inject(JwtService);
  const router = inject(Router);

  return from(jwtService.getAccessToken()).pipe(
    switchMap((accessToken) => {
      if (!accessToken) {
        router.navigate(['auth/login']);
        return of(false);
      }

      const now = Math.floor(Date.now() / 1000);
      const isTokenActive = accessToken.exp > now;

      if (isTokenActive) {
        return of(true);
      }

      return authService.refresh({ refreshToken: accessToken.refreshToken }).pipe(
        map((response: LoginResponseDto) => {
          if (response.accessToken) {
            jwtService.setItem('accessToken', response.accessToken);
            jwtService.setItem('refreshToken', response.refreshToken);
            return true;
          }
          router.navigate(['auth/login']);
          return false;
        }),
        catchError(() => {
          router.navigate(['auth/login']);
          return of(false);
        })
      );
    })
  );
};
