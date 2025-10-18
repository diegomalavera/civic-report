import {
  HttpException,
  HttpStatus,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { UserDto } from 'src/dtos';
import { Messages } from 'src/messages';

@Injectable()
export class UsersService {
  private userServiceEndpoint: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {
    this.userServiceEndpoint =
      this.configService.get<string>('USERS_SERVICE_ENDPOINT') || '';
  }

  async findById(id: string): Promise<UserDto> {
    try {
      const token = this.jwtService.sign({
        internal: true,
        permissions: ['auth_users_read'],
      });

      const response = await lastValueFrom(
        this.httpService.get(`${this.userServiceEndpoint}/${id}`, {
          headers: { Authorization: `Bearer ${token}` },
        }),
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
