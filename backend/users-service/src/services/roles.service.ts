import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  ServiceUnavailableException,
} from '@nestjs/common';
import { lastValueFrom } from 'rxjs';
import { HttpService } from '@nestjs/axios';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { RoleDto } from 'src/dtos';
import { Messages } from 'src/messages';

@Injectable()
export class RolesService {
  private rolesServiceEndpoint: string;

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly jwtService: JwtService,
  ) {
    this.rolesServiceEndpoint =
      this.configService.get<string>('ROLES_SERVICE_ENDPOINT') || '';
  }

  async findByIds(ids: string[]): Promise<RoleDto[]> {
    try {
      const token = this.jwtService.sign({
        internal: true,
        permissions: ['user_roles_read'],
      });

      const response = await lastValueFrom(
        this.httpService.get(
          `${this.rolesServiceEndpoint}/ids/${ids.join(',')}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          },
        ),
      );

      return response.data;
    } catch (error: unknown) {
      this.throwError(error);
    }
  }

  private throwError(error: unknown): never {
    if (error instanceof AxiosError) {
      if (!error.response) {
        throw new ServiceUnavailableException(
          Messages.ROLES_SERVICE_UNAVAILABLE,
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
