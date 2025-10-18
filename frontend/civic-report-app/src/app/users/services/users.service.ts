import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { UserDto } from '../dtos/user.dto';
import { ResponseDto } from '../../auth/dtos/response.dto';
import { UpdateUserDto } from '../dtos/update-user.dto';
import { CreateUserDto } from '../dtos/create-user.dto';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private baseUrl: string = environment.usersService;
  private httpClient: HttpClient = inject(HttpClient);

  findAll(): Observable<UserDto[]> {
    return this.httpClient
      .get<UserDto[]>(`${this.baseUrl}/users`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de usuarios no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }

  findById(id: string): Observable<UserDto> {
    return this.httpClient
      .get<UserDto>(`${this.baseUrl}/users/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de usuarios no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }

  create(createUserDto: CreateUserDto): Observable<UserDto> {
    return this.httpClient
      .post<UserDto>(`${this.baseUrl}/users`, createUserDto, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de usuarios no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }

  update(id: string, updateUserDto: UpdateUserDto): Observable<UserDto> {
    return this.httpClient
      .put<UserDto>(`${this.baseUrl}/users/${id}`, updateUserDto, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de usuarios no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }

  delete(id: string): Observable<ResponseDto> {
    return this.httpClient
      .delete<ResponseDto>(`${this.baseUrl}/users/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de usuarios no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }
}
