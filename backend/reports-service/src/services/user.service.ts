import { Inject, Injectable } from '@nestjs/common';
import { REQUEST } from '@nestjs/core';
import { PayloadDto } from 'src/dtos';

@Injectable()
export class UserService {
  constructor(@Inject(REQUEST) private readonly request: any) {}

  getCurrentUser(): PayloadDto {
    return this.request.user as PayloadDto;
  }
}
