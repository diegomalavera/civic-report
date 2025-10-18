export class CreateReportDto {
  name: string = '';
  description: string = '';
  city: string = '';
  state: string = '';
  country: string = '';
  address: string = '';
  latitude: string = '';
  longitude: string = '';
  images: Blob[] = [];
}
