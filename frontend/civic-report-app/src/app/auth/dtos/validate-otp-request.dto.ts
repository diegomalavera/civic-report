export class ValidateOtpRequestDto {
  readonly email!: string;
  readonly code!: string;
  readonly type!: string;
  readonly date!: Date;
}
