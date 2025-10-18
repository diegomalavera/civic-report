import { Type } from 'class-transformer';
import { IsDate, IsNotEmpty } from 'class-validator';

export class ValidateOtpRequestDto {
  @IsNotEmpty({ message: 'El correo electrónico es requerido.' })
  email!: string;

  @IsNotEmpty({ message: 'El codigo OTP es requerido.' })
  code!: string;

  @IsNotEmpty({ message: 'El tipo es requerido.' })
  type!: string;

  @Type(() => Date)
  @IsDate({ message: 'La fecha es requerida' })
  date!: Date;
}
