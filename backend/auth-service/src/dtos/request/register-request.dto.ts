import { Type } from "class-transformer";
import { IsDate, IsEmail, IsNotEmpty } from "class-validator";

export class RegisterRequestDto {
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  name!: string;

  @IsNotEmpty({ message: 'El apellido es requerido.' })
  lastName!: string;

  @IsNotEmpty({ message: 'El correo electrónico es requerido.' })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña es requerida.' })
  password!: string;

  @IsNotEmpty({ message: 'La confirmación de la contraseña es requerida.' })
  confirmPassword!: string;

  @Type(() => Date)
  @IsDate({ message: 'La fecha es requerida' })
  date!: Date;
}