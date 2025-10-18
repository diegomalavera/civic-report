import { ArrayNotEmpty, IsDefined, IsEmail, IsNotEmpty } from "class-validator";

export class CreateUserRequestDto {
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  name!: string;

  @IsNotEmpty({ message: 'El apellido es requerido.' })
  lastName!: string;

  @IsNotEmpty({ message: 'El correo electrónico es requerido.' })
  @IsEmail({}, { message: 'El correo electrónico no es válido.' })
  email!: string;

  @IsNotEmpty({ message: 'La contraseña es requerida.' })
  password!: string;

  @IsDefined({ message: 'El estado es requerido.' })
  enabled!: boolean;

  @IsDefined({ message: 'El estado protegido es requerido.' })
  protected!: boolean;

  @ArrayNotEmpty({ message: 'El rol es requerido.' })
  roleIds!: string[];
}
