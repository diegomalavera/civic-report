import {
  Exclude,
  Expose,
  Transform,
  Type,
  plainToInstance,
} from 'class-transformer';
import { RoleDto } from './role.dto.js';

@Exclude()
export class UserDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  lastName!: string;

  @Expose()
  @Transform(({ obj }) => `${obj.name} ${obj.lastName}`)
  fullName: string = '';

  @Expose()
  email!: string;

  @Expose({ groups: ['withPassword'] })
  password!: string;

  @Expose()
  enabled!: boolean;

  @Expose()
  protected!: boolean;

  @Expose()
  roleIds!: string[];

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt?: Date;

  @Expose({ groups: ['withRoles'] })
  @Type(() => RoleDto)
  roles!: RoleDto[];

  static mapUsers(users: any[], groups?: string[]): UserDto[] {
    return users.map((user) => {
      return plainToInstance(UserDto, user, {
        excludeExtraneousValues: true,
        groups: groups || [],
      });
    });
  }

  static mapUser(user: any, groups?: string[]): UserDto {
    return plainToInstance(UserDto, user, {
      groups: groups || [],
      excludeExtraneousValues: true,
    });
  }
}
