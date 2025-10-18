import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { GeocodingResponse } from '../dtos/geocoding.dto';

@Injectable({
  providedIn: 'root',
})
export class GoogleMapsService {
  apiUrl = environment.googleMaps.apiUrl;
  apiKey = environment.googleMaps.apiKey;

  async geocode(lat: number, lng: number): Promise<GeocodingResponse> {
    try {
      const url = `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${this.apiKey}`;
      const response: GeocodingResponse = await fetch(url).then((r) => r.json());
      if (response.status !== 'OK') {
        throw new Error();
      }
      return response;
    } catch (error) {
      throw new Error('El servicio de google maps no está disponible.');
    }
  }
}
