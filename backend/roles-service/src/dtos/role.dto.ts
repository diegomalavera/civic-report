import { Exclude, Expose, Transform, plainToInstance } from 'class-transformer';

@Exclude()
export class RoleDto {
  @Expose()
  @Transform(({ obj }) => obj._id.toString())
  id!: string;

  @Expose()
  name!: string;

  @Expose()
  code!: string;

  @Expose()
  description!: string;

  @Expose()
  enabled!: boolean;

  @Expose()
  protected!: boolean;

  @Expose()
  createdAt!: Date;

  @Expose()
  updatedAt?: Date;

  @Expose({ groups: ['withPermissions'] })
  permissions!: string[];

  static mapRoles(roles: any[], groups?: string[]): RoleDto[] {
    return roles.map((role) => {
      return plainToInstance(RoleDto, role, {
        excludeExtraneousValues: true,
        groups: groups || [],
      });
    });
  }

  static mapRole(role: any, groups?: string[]): RoleDto {
    return plainToInstance(RoleDto, role, {
      groups: groups || [],
      excludeExtraneousValues: true,
    });
  }
}
