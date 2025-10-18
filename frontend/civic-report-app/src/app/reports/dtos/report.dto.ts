export class ReportDto {
  id!: string;
  name!: string;
  description!: string;
  city!: string;
  state!: string;
  country!: string;
  address!: string;
  latitude!: number;
  longitude!: number;
  images: { name: string; url: string }[] = [];
  status!: string;
  comments: { author: string; message: string; createdAt: Date }[] = [];
  userId!: string;
  createdAt!: Date;
  updatedAt?: Date;
}
