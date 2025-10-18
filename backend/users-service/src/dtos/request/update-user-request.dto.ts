import { ArrayNotEmpty, IsDefined, IsEmail, IsNotEmpty } from "class-validator";

export class UpdateUserRequestDto {
  name?: string;

  lastName?: string;

  email?: string;

  password?: string;

  enabled?: boolean;

  protected?: boolean;

  roleIds?: string[];
}
