import { Type } from 'class-transformer';
import { IsDate, IsDateString, IsNotEmpty } from 'class-validator';

export class ValidateEmailRequestDto {
  @IsNotEmpty({ message: 'El correo electrónico es requerido.' })
  email!: string;

  @IsNotEmpty({ message: 'El tipo es requerido.' })
  type!: string;

  @Type(() => Date)
  @IsDate({ message: 'La fecha es requerida' })
  date!: Date;
}
