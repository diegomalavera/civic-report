import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Role, RoleDocument } from '../models/role.model';
import { CreateRoleRequestDto, ResponseDto, RoleDto, UpdateRoleRequestDto } from 'src/dtos';
import { Messages } from 'src/messages';

@Injectable()
export class RolesService {
  constructor(@InjectModel(Role.name) private roleModel: Model<RoleDocument>) {}

  async findAll(): Promise<RoleDto[]> {
    const roles: RoleDocument[] = await this.roleModel.find().exec();
    return RoleDto.mapRoles(roles);
  }

  async findByIds(ids: string): Promise<RoleDto[]> {
    const requestedIds = ids.split(',') || [];

    const roles: RoleDocument[] = await this.roleModel
      .find({ _id: { $in: requestedIds } })
      .exec();

    return RoleDto.mapRoles(roles, ['withPermissions']);
  }

  async findById(id: string): Promise<RoleDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(Messages.ROLE_ID_ERROR);
    }

    const role = await this.roleModel.findById(id).exec();

    if (!role) {
      throw new NotFoundException(Messages.ROLE_NOT_FOUND);
    }

    return RoleDto.mapRole(role, ['withPermissions']);
  }

  async findByCode(code: string): Promise<RoleDto> {
    const role = await this.roleModel.findOne({ code: code }).exec();

    if (!role) {
      throw new NotFoundException(Messages.ROLE_NOT_FOUND);
    }

    return RoleDto.mapRole(role, ['withPermissions']);
  }

  async create(createRoleRequestDto: CreateRoleRequestDto): Promise<RoleDto> {
    const existing = await this.roleModel.findOne({ code: createRoleRequestDto.code });

    if (existing) {
      throw new ConflictException(Messages.ROLE_ALREADY_EXIST);
    }

    const role: RoleDocument = new this.roleModel({
      ...createRoleRequestDto,
      createdAt: new Date(),
    });

    role.save();

    return RoleDto.mapRole(role, ['withPermissions']);
  }

  async update(id: string, updateRoleRequestDto: UpdateRoleRequestDto): Promise<RoleDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(Messages.ROLE_ID_ERROR);
    }

    const role = await this.roleModel.findById(id).exec();

    if (!role) {
      throw new NotFoundException(Messages.ROLE_NOT_FOUND);
    }

    Object.assign(role, updateRoleRequestDto);

    role.updatedAt = new Date();

    role.save();

    return RoleDto.mapRole(role, ['withPermissions']);
  }

  async delete(id: string): Promise<ResponseDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(Messages.ROLE_ID_ERROR);
    }

    const role = await this.roleModel.findById(id).exec();

    if (!role) {
      throw new NotFoundException(Messages.ROLE_NOT_FOUND);
    }

    if (role.protected) {
      throw new ForbiddenException(Messages.ROLE_CANNOT_BE_DELETED);
    }

    await this.roleModel.deleteOne({ _id: id }).exec();

    return Promise.resolve({
      message: Messages.ROLE_DELETED,
    });
  }
}
