import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  Logger,
  ServiceUnavailableException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { UpdateUserDto, UserDto } from 'src/dtos';
import { Messages } from 'src/messages';

@Injectable()
export class UsersService {
  private readonly logger: Logger = new Logger(UsersService.name);
  private userServiceEndpoint: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {
    this.userServiceEndpoint =
      this.configService.get<string>('USERS_SERVICE_ENDPOINT') || '';
  }

  async userExist(email: string): Promise<boolean> {
    try {
      const user = await this.findByEmail(email);

      return true;
    } catch (error: unknown) {
      return false;
    }
  }

  async findByEmail(email: string): Promise<UserDto> {
    try {
      const token = this.jwtService.sign(
        {
          internal: true,
          permissions: ['auth_users_read'],
        },
        {
          expiresIn: this.configService.get<string>(
            'JWT_INTERNAL_ACCESS_TOKEN_EXPIRES_IN',
          ),
        },
      );

      const response = await lastValueFrom(
        this.httpService.get(`${this.userServiceEndpoint}/email/${email}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      return response.data;
    } catch (error) {
      this.throwError(error);
    }
  }

  async create(userDto: UserDto): Promise<UserDto> {
    try {
      const token = this.jwtService.sign(
        {
          internal: true,
          permissions: ['auth_users_create'],
        },
        {
          expiresIn: this.configService.get<string>(
            'JWT_INTERNAL_ACCESS_TOKEN_EXPIRES_IN',
          ),
        },
      );

      const response = await lastValueFrom(
        this.httpService.post(this.userServiceEndpoint, userDto, {
          headers: { Authorization: `Bearer ${token}` },
        }),
      );

      return response.data;
    } catch (error) {
      this.throwError(error);
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<UserDto> {
    try {
      const token = this.jwtService.sign(
        {
          internal: true,
          permissions: ['auth_users_update'],
        },
        {
          expiresIn: this.configService.get<string>(
            'JWT_INTERNAL_ACCESS_TOKEN_EXPIRES_IN',
          ),
        },
      );

      const response = await lastValueFrom(
        this.httpService.put(
          `${this.userServiceEndpoint}/${id}`,
          updateUserDto,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      );

      return response.data;
    } catch (error) {
      this.throwError(error);
    }
  }

  private throwError(error: unknown): never {
    if (error instanceof AxiosError) {
      if (!error.response) {
        throw new ServiceUnavailableException(
          Messages.USERS_SERVICE_UNAVAILABLE,
        );
      }
      throw new HttpException(
        {
          message: error.response.data.message,
          error: error.response.data.error,
          statusCode: error.response.data.statusCode,
        },
        error.response.status,
      );
    } else if (error instanceof Error) {
      throw new InternalServerErrorException(error.message);
    } else {
      throw new InternalServerErrorException(error);
    }
  }
}
