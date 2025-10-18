import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { RoleDto } from '../../users/dtos/role.dto';
import { UpdateRoleDto } from '../dtos/update-rol.dto';
import { CreateRoleDto } from '../dtos/create-rol.dto';
import { ResponseDto } from '../../auth/dtos/response.dto';

@Injectable({
  providedIn: 'root',
})
export class RolesService {
  private baseUrl: string = environment.rolesService;
  private httpClient: HttpClient = inject(HttpClient);

  findAll(): Observable<RoleDto[]> {
    return this.httpClient
      .get<RoleDto[]>(`${this.baseUrl}/roles`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de roles no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }

  findById(id: string): Observable<RoleDto> {
    return this.httpClient
      .get<RoleDto>(`${this.baseUrl}/roles/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de roles no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }

  create(createRoleDto: CreateRoleDto): Observable<RoleDto> {
    return this.httpClient
      .post<RoleDto>(`${this.baseUrl}/roles`, createRoleDto, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de roles no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }

  update(id: string, updateRoleDto: UpdateRoleDto): Observable<RoleDto> {
    return this.httpClient
      .put<RoleDto>(`${this.baseUrl}/roles/${id}`, updateRoleDto, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de roles no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }

  delete(id: string): Observable<ResponseDto> {
    return this.httpClient
      .delete<ResponseDto>(`${this.baseUrl}/roles/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de roles no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }
}
