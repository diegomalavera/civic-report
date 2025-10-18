import { ArrayNotEmpty, IsDefined, IsNotEmpty } from "class-validator";

export class CreateReportRequestDto {
  @IsNotEmpty({ message: 'El nombre es requerido.' })
  name!: string;

  @IsNotEmpty({ message: 'La descripción es requerida.' })
  description!: string;

  @IsNotEmpty({ message: 'La ciudad es requerida.' })
  city!: string;

  @IsNotEmpty({ message: 'El departamento es requerido.' })
  state!: string;

  @IsNotEmpty({ message: 'El pais es requerido.' })
  country!: string;

  @IsNotEmpty({ message: 'La dirección es requerida.' })
  address!: string;

  @IsNotEmpty({ message: 'La latitud es requerida.' })
  latitude!: number;

  @IsNotEmpty({ message: 'La longitud es requerida.' })
  longitude!: number;

  images!: Express.Multer.File[];
}
