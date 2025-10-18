import { IsNotEmpty } from "class-validator";

export class CreateCommentRequestDto {
  @IsNotEmpty({ message: 'El comentario es requerido.' })
  message!: string;
}
