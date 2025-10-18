import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { LoginRequestDto } from '../dtos/request/login-request.dto';
import { LoginResponseDto } from '../dtos/response/login-response.dto';
import { RefreshRequestDto } from 'src/dtos/request/refresh-request.dto';
import { AuthService } from 'src/services/auth.service';
import { RegisterRequestDto } from 'src/dtos/request/register-request.dto';
import { ChangePasswordRequestDto, ResponseDto } from 'src/dtos';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  @HttpCode(200)
  async login(@Body() request: LoginRequestDto): Promise<LoginResponseDto> {
    return this.authService.login(request);
  }

  @Post('refresh')
  @HttpCode(200)
  refresh(@Body() request: RefreshRequestDto): Promise<LoginResponseDto> {
    return this.authService.refresh(request);
  }

  @Post('change-password')
  @HttpCode(200)
  changePasword(@Body() request: ChangePasswordRequestDto): Promise<ResponseDto> {
    return this.authService.changePassword(request);
  }

  @Post('register')
  @HttpCode(200)
  register(@Body() request: RegisterRequestDto): Promise<LoginResponseDto> {
    return this.authService.register(request);
  }
}
