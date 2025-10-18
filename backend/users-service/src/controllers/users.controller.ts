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
import { UsersService } from '../services/users.service';
import { PermissionsGuard } from 'src/security/permissions.guard';
import { AuthGuard } from '@nestjs/passport';
import { Permissions } from 'src/security/permissions.decorator';
import { CreateUserRequestDto, ResponseDto, UpdateUserRequestDto, UserDto } from 'src/dtos';

@Controller('users')
@UseGuards(AuthGuard('jwt'), PermissionsGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Permissions('users_read')
  findAll(): Promise<UserDto[]> {
    return this.usersService.findAll();
  }

  @Get(':id')
  @Permissions('users_read', 'auth_users_read')
  findById(@Param('id') id: string): Promise<UserDto> {
    return this.usersService.findById(id);
  }

  @Get('email/:email')
  @Permissions('users_read', 'auth_users_read')
  findByEmail(@Param('email') email: string): Promise<UserDto> {
    return this.usersService.findByEmail(email);
  }

  @Post()
  @Permissions('users_create', 'auth_users_create')
  create(@Body() createUserRequestDto: CreateUserRequestDto): Promise<UserDto> {
    return this.usersService.create(createUserRequestDto);
  }

  @Put(':id')
  @Permissions('users_update', 'auth_users_update', 'user_update')
  update(@Param('id') id: string, @Body() updateUserRequestDto: UpdateUserRequestDto): Promise<UserDto> {
    return this.usersService.update(id, updateUserRequestDto);
  }

  @Delete(':id')
  @Permissions('users_delete')
  delete(@Param('id') id: string): Promise<ResponseDto> {
    return this.usersService.delete(id);
  }
}
