import { Expose, Transform } from 'class-transformer';

export class PayloadDto {
  @Expose()
  @Transform(({ obj }) => obj.sub.toString())
  id: string = '';

  @Expose()
  sub!: string;

  @Expose()
  email!: string;

  @Expose()
  name!: string;

  @Expose()
  lastName!: string;

  @Expose()
  permissions!: string[];

  @Expose()
  iat!: number;

  @Expose()
  exp!: number;

  @Expose()
  aud!: string[];

  @Expose()
  iss!: string;

  @Expose()
  internal!: boolean;
}
