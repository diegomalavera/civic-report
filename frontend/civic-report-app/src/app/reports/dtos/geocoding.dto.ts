export interface GeocodingResponse {
  results: GeocodingResult[];
  status: string;
}

export interface GeocodingResult {
  formatted_address: string;
  geometry: Geometry;
  address_components: AddressComponent[];
  place_id: string;
}

export interface Geometry {
  location: {
    lat: number;
    lng: number;
  };
  location_type: string;
  viewport: {
    northeast: { lat: number; lng: number };
    southwest: { lat: number; lng: number };
  };
}

export interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}
