import { RoleDto } from './role.dto';

export class UserDto {
  id: string = '';
  name: string = '';
  lastName: string = '';
  fullName: string = '';
  email: string = '';
  password: string = '';
  enabled: boolean = false;
  protected: boolean = false;
  createdAt?: Date;
  updatedAt?: Date;
  roles: RoleDto[] = [];
  roleIds: string[] = [];
}
