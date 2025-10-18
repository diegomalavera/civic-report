import {
  ConflictException,
  Injectable,
  Logger,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { UsersService } from './users.service';
import { LoginRequestDto } from 'src/dtos/request/login-request.dto';
import { LoginResponseDto } from 'src/dtos/response/login-response.dto';
import { RefreshRequestDto } from 'src/dtos/request/refresh-request.dto';
import { ConfigService } from '@nestjs/config';
import { OtpService } from './otp.service';
import { RegisterRequestDto } from 'src/dtos/request/register-request.dto';
import { RolesService } from './roles.service';
import {
  ChangePasswordRequestDto,
  PayloadDto,
  ResponseDto,
  RoleDto,
  UpdateUserDto,
  UserDto,
} from 'src/dtos';
import { Messages } from 'src/messages';

@Injectable()
export class AuthService {
  private readonly logger: Logger = new Logger(AuthService.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly rolesService: RolesService,
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
    private readonly otpService: OtpService,
  ) {}

  async login(request: LoginRequestDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(request.email);

    const isPasswordValid = await bcrypt.compare(
      request.password,
      user.password,
    );

    if (!isPasswordValid) {
      throw new UnauthorizedException(Messages.INVALID_CREDENTIALS);
    }

    if (!user.enabled) {
      throw new UnauthorizedException(Messages.USER_DISABLED);
    }

    const permissions: string[] = user.roles.flatMap(
      (role: RoleDto) => role.permissions,
    );

    const tokens = await this.signTokens(user, permissions);

    return Promise.resolve({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  async refresh(request: RefreshRequestDto): Promise<LoginResponseDto> {
    const oldPayload: PayloadDto = await this.jwtService.verify(
      request.refreshToken,
    );

    const user = await this.usersService.findByEmail(oldPayload.email);

    if (!user) {
      throw new UnauthorizedException(Messages.USER_NOT_FOUND);
    }

    if (!user.enabled) {
      throw new UnauthorizedException(Messages.USER_DISABLED);
    }

    const permissions: string[] = user.roles.flatMap(
      (role: RoleDto) => role.permissions,
    );

    const tokens = await this.signTokens(user, permissions);

    return Promise.resolve({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  async changePassword(
    request: ChangePasswordRequestDto,
  ): Promise<ResponseDto> {
    const isValid: boolean = await this.otpService.validateOtp({
      email: request.email,
      type: 'forgot-password',
      date: request.date,
    });

    if (!isValid) {
      throw new ConflictException(Messages.OTP_EXPIRED);
    }

    const user: UserDto = await this.usersService.findByEmail(request.email);

    if (request.password != request.confirmPassword) {
      throw new ConflictException(Messages.PASSWORD_MISMATCH);
    }

    const updateUserDto: UpdateUserDto = {
      password: request.password
    };

    await this.usersService.update(user.id, updateUserDto);

    await this.otpService.consumeOtp(request.email, 'forgot-password');

    return Promise.resolve({
      message: Messages.PASSWORD_UPDATED,
    });
  }

  async register(request: RegisterRequestDto): Promise<LoginResponseDto> {
    const isValid: boolean = await this.otpService.validateOtp({
      email: request.email,
      type: 'register',
      date: request.date,
    });

    if (!isValid) {
      throw new ConflictException(Messages.OTP_EXPIRED);
    }

    const userExist: boolean = await this.usersService.userExist(request.email);

    if (userExist) {
      throw new ConflictException(Messages.USER_ALREADY_EXIST);
    }

    const userDto: UserDto = new UserDto();

    Object.assign(userDto, request);

    userDto.enabled = true;

    userDto.protected = false;

    const roleDtol: RoleDto = await this.rolesService.findByCode('user');

    userDto.roleIds = [roleDtol.id];

    const user: UserDto = await this.usersService.create(userDto);

    await this.otpService.consumeOtp(request.email, 'register');

    const permissions: string[] = user.roles.flatMap(
      (role) => role.permissions,
    );

    const payload = {
      sub: user.id,
      email: user.email,
      permissions: permissions,
    } as PayloadDto;

    const tokens = await this.signTokens(user, permissions);

    return Promise.resolve({
      accessToken: tokens.accessToken,
      refreshToken: tokens.refreshToken,
    });
  }

  private async signTokens(user: UserDto, permissions: string[]) {
    const payload = {
      sub: user.id,
      name: user.name,
      lastName: user.lastName,
      email: user.email,
      permissions: permissions,
    } as PayloadDto;

    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(payload, {
        expiresIn: this.configService.get<string>(
          'JWT_ACCESS_TOKEN_EXPIRES_IN',
        ),
      }),
      this.jwtService.signAsync(
        {
          sub: payload.sub,
          email: payload.email,
          name: payload.name,
          lastName: payload.lastName,
        },
        {
          expiresIn: this.configService.get<string>(
            'JWT_REFRESH_TOKEN_EXPIRES_IN',
          ),
        },
      ),
    ]);
    return { accessToken, refreshToken };
  }
}
