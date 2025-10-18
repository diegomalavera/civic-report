export class ValidateOtpDto {
  email!: string;
  type!: string;
  date!: Date;
  code?: string;
}