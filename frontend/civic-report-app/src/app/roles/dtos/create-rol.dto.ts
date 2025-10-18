export class CreateRoleDto {
  name!: string;
  code!: string;
  description!: string;
  enabled!: boolean;
  protected!: boolean;
  permissions!: string[];
}
