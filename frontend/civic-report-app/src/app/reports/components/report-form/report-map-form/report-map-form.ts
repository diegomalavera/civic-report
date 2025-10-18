import { Component, OnInit, AfterViewInit, inject } from '@angular/core';
import { GoogleMap as GoogleMapCapacitor } from '@capacitor/google-maps';
import { Capacitor } from '@capacitor/core';
import { GoogleMap, MapAdvancedMarker } from '@angular/google-maps';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Router } from '@angular/router';
import { PageService } from '../../../../core/services/page.service';
import { ReportsService } from '../../../services/reports.service';
import { ReportDto } from '../../../dtos/report.dto';
import { environment } from '../../../../../environments/environment';
import { GoogleMapsService } from '../../../services/google-maps.service';
import { GeocodingResponse } from '../../../dtos/geocoding.dto';
import { MessageService } from '../../../../core/services/message.service';
import { Geolocation } from '@capacitor/geolocation';

@Component({
  selector: 'app-report-map-form',
  imports: [
    GoogleMap,
    MapAdvancedMarker,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  templateUrl: './report-map-form.html',
  styleUrl: './report-map-form.scss',
})
export class ReportMapForm implements OnInit, AfterViewInit {
  router: Router = inject(Router);
  pageService: PageService = inject(PageService);
  messageService: MessageService = inject(MessageService);
  reportsService: ReportsService = inject(ReportsService);
  googleMapsService: GoogleMapsService = inject(GoogleMapsService);
  center: google.maps.LatLngLiteral = { lat: 4.711, lng: -74.072 };
  zoom = 12;
  markerPosition: google.maps.LatLngLiteral | undefined;
  apiKey = environment.googleMaps.apiKey;
  mapId = environment.googleMaps.mapId;
  isWeb: boolean = true;

  ngOnInit(): void {
    this.pageService.setPrevious('/app/reports/create');
    this.pageService.setTitle('Crear reporte - Ubicación');
    if (this.reportsService.report.name === '' || this.reportsService.report.description === '') {
      this.router.navigate(['/app/reports/create']);
    }
    if (this.reportsService.report.images.length <= 0) {
      this.router.navigate(['/app/reports/create/images']);
    }
  }

  async ngAfterViewInit() {
    this.isWeb = Capacitor.getPlatform() === 'web';
  }

  next() {
    if (this.markerPosition) {
      this.saveReport();
    } else {
      this.messageService.showMessage('Debes seleccionar la ubicación en el mapa.');
    }
  }

  saveReport() {
    this.reportsService.create(this.reportsService.report).subscribe({
      next: async (report: ReportDto) => {
        this.messageService.showMessage('Reporte creado correctamente.').then(() => {
          this.router.navigate(['/app/reports/list']);
        });
      },
      error: (error: Error) => {
        this.messageService.showMessage(error.message);
      },
    });
  }

  async userLocation() {
    if (this.isWeb) {
      this.userNavigatorLocation();
    } else {
      this.userCapacitorLocation();
    }
  }

  async userCapacitorLocation() {
    const position = await Geolocation.getCurrentPosition();
    const center = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    this.center = {
      lat: position.coords.latitude,
      lng: position.coords.longitude,
    };
    this.markerPosition = this.center;
    this.zoom = 18;

    this.getGeocodes(position.coords.latitude, position.coords.longitude);
  }

  userNavigatorLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          this.center = {
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          };
          this.markerPosition = this.center;
          this.zoom = 18;
        },
        (error) => {
          console.warn('Error al obtener ubicación:', error);
        }
      );
    } else {
      alert('La geolocalización no es compatible con este navegador.');
    }
  }

  async getGeocodes(lat: number, lng: number) {
    try {
      const response: GeocodingResponse = await this.googleMapsService.geocode(lat, lng);
      const components = response.results[0].address_components;
      const city = components.find((c: any) => c.types.includes('locality'))?.long_name || '';
      const state =
        components.find((c: any) => c.types.includes('administrative_area_level_1'))?.long_name ||
        '';
      const country = components.find((c: any) => c.types.includes('country'))?.long_name || '';
      const route = components.find((c: any) => c.types.includes('route'))?.long_name || '';
      const streetNumber =
        components.find((c: any) => c.types.includes('street_number'))?.long_name || '';
      const address = route && streetNumber ? `${route} #${streetNumber}` : route || streetNumber;
      this.reportsService.report.city = city;
      this.reportsService.report.state = state;
      this.reportsService.report.country = country;
      this.reportsService.report.address = address;
      this.reportsService.report.latitude = String(lat);
      this.reportsService.report.longitude = String(lng);
    } catch (error: any) {
      this.messageService.showMessage(error.message);
    }
  }

  mapClick(event: google.maps.MapMouseEvent) {
    if (!event.latLng) return;
    this.markerPosition = {
      lat: event.latLng.lat(),
      lng: event.latLng.lng(),
    };
    this.getGeocodes(event.latLng.lat(), event.latLng.lng());
  }
}
