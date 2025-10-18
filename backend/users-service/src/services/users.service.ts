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
import { User, UserDocument } from '../models/user.model';
import * as bcrypt from 'bcrypt';
import { RolesService } from './roles.service';
import { CreateUserRequestDto, ResponseDto, UpdateUserRequestDto, UserDto } from 'src/dtos';
import { Messages } from 'src/messages';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);

  constructor(
    @InjectModel(User.name) private userModel: Model<UserDocument>,
    private readonly rolesService: RolesService,
  ) {}

  async findAll(): Promise<UserDto[]> {
    const users: UserDocument[] = await this.userModel.find().exec();
    return UserDto.mapUsers(users);
  }

  async findById(id: string): Promise<UserDto> {
    if (!Types.ObjectId.isValid(id)) {
      throw new BadRequestException(Messages.USER_ID_ERROR);
    }

    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(Messages.USER_NOT_FOUND);
    }

    const userDto = UserDto.mapUser(user);

    userDto.roleIds = user.roleIds.map((id) => id.toString());

    userDto.roles = await this.rolesService.findByIds(userDto.roleIds);

    return userDto;
  }

  async findByEmail(email: string): Promise<UserDto> {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) {
      throw new NotFoundException(Messages.USER_NOT_FOUND);
    }

    const userDto: UserDto = UserDto.mapUser(user, ['withPassword']);

    const roleIds: string[] = user.roleIds.map((id) => id.toString());

    userDto.roles = await this.rolesService.findByIds(roleIds);

    return userDto;
  }

  async create(createUserRequestDto: CreateUserRequestDto): Promise<UserDto> {
    const exist: UserDocument | null = await this.userModel.findOne({
      email: createUserRequestDto.email,
    });

    if (exist) {
      throw new ConflictException(Messages.USER_EMAIL_ALREADY_EXIST);
    }

    const hashedPassword: string = await bcrypt.hash(
      createUserRequestDto.password,
      10,
    );

    const user: UserDocument = new this.userModel({
      ...createUserRequestDto,
      password: hashedPassword,
    });

    if (createUserRequestDto.roleIds && createUserRequestDto.roleIds.length > 0) {
      user.roleIds = createUserRequestDto.roleIds.map((id) => new Types.ObjectId(id));
    }

    user.save();

    const userDto = UserDto.mapUser(user);

    const roleIds: string[] = user.roleIds.map((id) => id.toString());

    userDto.roles = await this.rolesService.findByIds(roleIds);

    return userDto;
  }

  async update(id: string, updateUserRequestDto: UpdateUserRequestDto): Promise<UserDto> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(Messages.USER_NOT_FOUND);
    }

    Object.assign(user, updateUserRequestDto);

    if (updateUserRequestDto.password != null) {
      const hashedPassword = await bcrypt.hash(updateUserRequestDto.password, 10);
      user.password = hashedPassword;
    }

    user.updatedAt = new Date();

    user.save();

    return UserDto.mapUser(user);
  }

  async delete(id: string): Promise<ResponseDto> {
    const user = await this.userModel.findById(id).exec();

    if (!user) {
      throw new NotFoundException(Messages.USER_NOT_FOUND);
    }

    if (user.protected) {
      throw new ForbiddenException(Messages.USER_CANNOT_BE_DELETED);
    }

    await this.userModel.deleteOne({ _id: id }).exec();

    return Promise.resolve({
      message: Messages.USER_DELETED,
    });
  }
}
