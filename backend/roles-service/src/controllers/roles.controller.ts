import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  UseGuards,
} from '@nestjs/common';
import { RolesService } from '../services/roles.service';
import { PermissionsGuard } from 'src/security/permissions.guard';
import { AuthGuard } from '@nestjs/passport';
import { CreateRoleRequestDto, ResponseDto, RoleDto, UpdateRoleRequestDto } from 'src/dtos';
import { Permissions } from 'src/security/permissions.decorator';

@Controller('roles')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class RolesController {
  constructor(private readonly rolesService: RolesService) {}

  @Get()
  @Permissions('roles_read')
  findAll(): Promise<RoleDto[]> {
    return this.rolesService.findAll();
  }

  @Get('ids/:ids')
  @Permissions('roles_read', 'user_roles_read')
  findByIds(@Param('ids') ids: string): Promise<RoleDto[]> {
    return this.rolesService.findByIds(ids);
  }

  @Get(':id')
  @Permissions('roles_read')
  findById(@Param('id') id: string): Promise<RoleDto> {
    return this.rolesService.findById(id);
  }

  @Get('code/:code')
  @Permissions('roles_read', 'auth_roles_read')
  findByCode(@Param('code') code: string): Promise<RoleDto> {
    return this.rolesService.findByCode(code);
  }

  @Post()
  @Permissions('roles_create')
  create(@Body() createRoleRequestDto: CreateRoleRequestDto): Promise<RoleDto> {
    return this.rolesService.create(createRoleRequestDto);
  }

  @Put(':id')
  @Permissions('roles_update')
  update(
    @Param('id') id: string,
    @Body() updateRoleRequestDto: UpdateRoleRequestDto,
  ): Promise<RoleDto> {
    return this.rolesService.update(id, updateRoleRequestDto);
  }

  @Delete(':id')
  @Permissions('roles_delete')
  delete(@Param('id') id: string): Promise<ResponseDto> {
    return this.rolesService.delete(id);
  }
}
