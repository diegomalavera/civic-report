import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ResponseDto } from '../dtos/response.dto';
import { ValidateOtpRequestDto } from '../dtos/validate-otp-request.dto';

@Injectable({
  providedIn: 'root',
})
export class OtpService {
  private readonly baseUrl: string = environment.authService;
  private readonly httpClient: HttpClient = inject(HttpClient);
  type: string = '';
  expiration: string = '';
  name: string = '';
  lastName: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';

  validateOtp(validateOtpRequestDto: ValidateOtpRequestDto): Observable<ResponseDto> {
    return this.httpClient
      .post<ResponseDto>(`${this.baseUrl}/auth/otp/validate-otp`, validateOtpRequestDto, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de autenticación no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }
}
