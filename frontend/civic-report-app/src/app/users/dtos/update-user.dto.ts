export class UpdateUserDto {
  name?: string;
  lastName?: string;
  email?: string;
  password?: string;
  enabled?: boolean;
  protected?: boolean;
  roleIds?: string[];
}
