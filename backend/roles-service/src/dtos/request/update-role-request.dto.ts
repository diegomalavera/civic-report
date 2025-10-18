import { ArrayNotEmpty, IsDefined, IsNotEmpty } from 'class-validator';

export class UpdateRoleRequestDto {
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  name!: string;

  @IsNotEmpty({ message: 'El código es requerido.' })
  code!: string;

  @IsNotEmpty({ message: 'La descripción es requerida.' })
  description!: string;

  @IsDefined({ message: 'El estado es requerido.' })
  enabled!: boolean;

  @IsDefined({ message: 'El estado protegido es requerido.' })
  protected!: boolean;

  @ArrayNotEmpty({ message: 'Los permisos son requeridos.' })
  permissions!: string[];
}
