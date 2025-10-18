import { Body, Controller, HttpCode, Post } from '@nestjs/common';
import { ValidateEmailRequestDto } from '../dtos/request/validate-email-request.dto';
import { OtpService } from 'src/services/otp.service';
import { ResponseDto } from 'src/dtos/response/response.dto';
import { ValidateOtpRequestDto } from 'src/dtos';

@Controller('auth/otp')
export class OtpController {
  constructor(private readonly otpService: OtpService) {}

  @Post('validate-email')
  @HttpCode(200)
  validateEmail(
    @Body() request: ValidateEmailRequestDto,
  ): Promise<ResponseDto> {
    return this.otpService.generateOtp(request);
  }

  @Post('validate-otp')
  @HttpCode(200)
  validateOtp(@Body() request: ValidateOtpRequestDto): Promise<ResponseDto> {
    return this.otpService.validateOtpCode(request);
  }
}
