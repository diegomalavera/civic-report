import { HttpInterceptorFn } from '@angular/common/http';
import { JwtService } from '../../auth/services/jwt.service';
import { inject } from '@angular/core';
import { from, switchMap } from 'rxjs';

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
  const jwtService: JwtService = inject(JwtService);

  return from(jwtService.getItem('accessToken')).pipe(
    switchMap((accessToken) => {
      if (accessToken) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${accessToken}`,
          },
        });
        return next(authReq);
      }
      return next(req);
    })
  );
};
