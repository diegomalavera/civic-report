import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';

@Exclude()
export class ReportDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  description!: string;

  @Expose()
  city!: string;

  @Expose()
  state!: string;

  @Expose()
  country!: string;

  @Expose()
  address!: string;

  @Expose()
  latitude!: number;

  @Expose()
  longitude!: number;

  @Expose()
  images: { name: string; url: string }[] = [];

  @Expose()
  status!: string;

  @Expose()
  comments: { author: string; message: string; createdAt: Date }[] = [];

  @Expose()
  userId!: string;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt?: Date;

  static mapReports(reports: any[], groups?: string[]): ReportDto[] {
    return reports.map((report) => {
      return plainToInstance(ReportDto, report, {
        excludeExtraneousValues: true,
        groups: groups || [],
      });
    });
  }

  static mapReport(report: any, groups?: string[]): ReportDto {
    return plainToInstance(ReportDto, report, {
      groups: groups || [],
      excludeExtraneousValues: true,
    });
  }
}
