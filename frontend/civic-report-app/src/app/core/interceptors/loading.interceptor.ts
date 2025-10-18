import { HttpRequest, HttpHandlerFn, HttpEvent, HttpEventType } from '@angular/common/http';
import { finalize, Observable } from 'rxjs';
import { inject } from '@angular/core';
import { LoadingService } from '../services/loading.service';

export const loadingInterceptor = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const loadingService: LoadingService = inject(LoadingService);
  loadingService.showLoading();
  return next(req).pipe(finalize(() => loadingService.hideLoading()));
};
