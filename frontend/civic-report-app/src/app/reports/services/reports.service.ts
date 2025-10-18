import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, map, Observable, throwError } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ReportDto } from '../dtos/report.dto';
import { CreateReportDto } from '../dtos/create-report.dto';

interface Payload {
  images: Blob[];
}

@Injectable({
  providedIn: 'root',
})
export class ReportsService {
  private baseUrl: string = environment.reportsService;
  private httpClient: HttpClient = inject(HttpClient);
  report: CreateReportDto = {
    name: '',
    description: '',
    city: '',
    state: '',
    country: '',
    address: '',
    latitude: '',
    longitude: '',
    images: [],
  } as CreateReportDto;

  findAll(): Observable<ReportDto[]> {
    return this.httpClient
      .get<ReportDto[]>(`${this.baseUrl}/reports`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de reportes no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }

  findById(id: string): Observable<ReportDto> {
    return this.httpClient
      .get<ReportDto>(`${this.baseUrl}/reports/${id}`, {
        headers: { 'Content-Type': 'application/json' },
      })
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de reportes no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }

  create(createReportDto: CreateReportDto): Observable<ReportDto> {
    const formData = new FormData();
    formData.append('name', createReportDto.name);
    formData.append('description', createReportDto.description);
    formData.append('city', createReportDto.city);
    formData.append('state', createReportDto.state);
    formData.append('country', createReportDto.country);
    formData.append('address', createReportDto.address);
    formData.append('latitude', createReportDto.latitude);
    formData.append('longitude', createReportDto.longitude);
    createReportDto.images.forEach((image) => {
      formData.append('images', image);
    });
    return this.httpClient.post<ReportDto>(`${this.baseUrl}/reports`, formData).pipe(
      catchError((httpErrorResponse: HttpErrorResponse) => {
        if (!httpErrorResponse.status) {
          return throwError(() => new Error('El servicio de reportes no está disponible.'));
        } else {
          return throwError(() => new Error(httpErrorResponse.error.message));
        }
      })
    );
  }

  addComment(id: string, message: string): Observable<ReportDto> {
    return this.httpClient
      .post<ReportDto>(
        `${this.baseUrl}/reports/${id}/comment`,
        { message: message },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
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

  updateStatus(id: string, status: string): Observable<ReportDto> {
    return this.httpClient
      .put<ReportDto>(
        `${this.baseUrl}/reports/${id}`,
        { status: status },
        {
          headers: { 'Content-Type': 'application/json' },
        }
      )
      .pipe(
        catchError((httpErrorResponse: HttpErrorResponse) => {
          if (!httpErrorResponse.status) {
            return throwError(() => new Error('El servicio de reportes no está disponible.'));
          } else {
            return throwError(() => new Error(httpErrorResponse.error.message));
          }
        })
      );
  }
}
