import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { LoginRequestDto } from '../dtos/login-request.dto';
import { LoginResponseDto } from '../dtos/login-response.dto';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { JwtService } from './jwt.service';
import { RefreshRequestDto } from '../dtos/refresh-request.dto';
import { ValidateEmailRequestDto } from '../dtos/validate-email-request.dto';
import { ResponseDto } from '../dtos/response.dto';
import { ValidateEmailResponseDto } from '../dtos/validate-email-response.dto';
import { ChangePasswordRequestDto } from '../dtos/change-password-request.dto';
import { RegisterRequestDto } from '../dtos/register-request.dto';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private baseUrl: string = environment.authService;
  private httpClient: HttpClient = inject(HttpClient);
  private jwtService: JwtService = inject(JwtService);

  login(loginRequest: LoginRequestDto): Observable<LoginResponseDto> {
    return this.httpClient
      .post<LoginResponseDto>(`${this.baseUrl}/auth/login`, loginRequest, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((loginResponseDto: LoginResponseDto) => {
          this.jwtService.saveLogin(loginResponseDto);
          return loginResponseDto;
        }),
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de autenticación no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }

  refresh(refreshRequest: RefreshRequestDto): Observable<LoginResponseDto> {
    return this.httpClient
      .post<LoginResponseDto>(`${this.baseUrl}/auth/refresh`, refreshRequest, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((loginResponseDto: LoginResponseDto) => {
          this.jwtService.saveLogin(loginResponseDto);
          return loginResponseDto;
        }),
        catchError((httpErrorResponse: HttpErrorResponse) => {
          this.jwtService.clear();
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de autenticación no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }

  validateEmail(
    validateEmailRequestDto: ValidateEmailRequestDto
  ): Observable<ValidateEmailResponseDto> {
    return this.httpClient
      .post<ValidateEmailResponseDto>(
        `${this.baseUrl}/auth/otp/validate-email`,
        validateEmailRequestDto,
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
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

  changePassword(changePasswordRequestDto: ChangePasswordRequestDto): Observable<ResponseDto> {
    return this.httpClient
      .post<ResponseDto>(`${this.baseUrl}/auth/change-password`, changePasswordRequestDto, {
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

  register(registerRequestDto: RegisterRequestDto): Observable<LoginResponseDto> {
    return this.httpClient
      .post<LoginResponseDto>(`${this.baseUrl}/auth/register`, registerRequestDto, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        map((loginResponseDto: LoginResponseDto) => {
          this.jwtService.saveLogin(loginResponseDto);
          return loginResponseDto;
        }),
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de autenticación no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }

  logout() {
    this.jwtService.clear();
  }
}
