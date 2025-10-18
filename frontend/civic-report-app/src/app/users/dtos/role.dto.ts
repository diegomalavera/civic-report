export class RoleDto {
  id!: string;
  name!: string;
  code!: string;
  description!: string;
  enabled!: boolean;
  protected!: boolean;
  createdAt!: Date;
  updatedAt?: Date;
  permissions?: string[];
}
