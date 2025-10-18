import { IsNotEmpty } from 'class-validator';

export class UpdateReportRequestDto {
  @IsNotEmpty({ message: 'El estado es requerido.' })
  status!: string;
}
