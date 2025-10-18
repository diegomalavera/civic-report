import { IsNotEmpty } from 'class-validator';

export class RefreshRequestDto {
  @IsNotEmpty({ message: 'El refresh token es requerido.' })
  refreshToken!: string;
}
