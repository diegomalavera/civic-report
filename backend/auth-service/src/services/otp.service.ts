import { ConflictException, Injectable, Logger } from '@nestjs/common';
import { Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { Otp, OtpDocument } from 'src/models/otp.model';
import { UsersService } from './users.service';
import { MailerService } from '@nestjs-modules/mailer';
import {
  ResponseDto,
  ValidateEmailRequestDto,
  ValidateOtpRequestDto,
} from 'src/dtos';
import { Messages } from 'src/messages';
import { EmailSubjects } from 'src/messages/subjects';
import { ValidateOtpDto } from 'src/dtos/validate-otp.dto';

@Injectable()
export class OtpService {
  private readonly logger: Logger = new Logger(OtpService.name);

  constructor(
    @InjectModel(Otp.name) private otpModel: Model<OtpDocument>,
    private readonly usersService: UsersService,
    private readonly mailerService: MailerService,
  ) {}

  async generate(request: ValidateEmailRequestDto): Promise<Otp> {
    const email = request.email;

    const type = request.type;

    const result = await this.otpModel.deleteMany({ email, type });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    const createdAt: Date = new Date(request.date);

    const expiresAt: Date = new Date(request.date);

    expiresAt.setMinutes(expiresAt.getMinutes() + 5);

    return await this.otpModel.create({
      email,
      code,
      type,
      createdAt,
      expiresAt,
    });
  }

  async generateOtp(request: ValidateEmailRequestDto): Promise<ResponseDto> {
    const userExist: boolean = await this.usersService.userExist(request.email);

    if (request.type == 'forgot-password') {
      if (!userExist) {
        throw new ConflictException(Messages.USER_NOT_FOUND);
      }
    }

    if (request.type == 'register' || request.type == 'account-update') {
      if (userExist) {
        throw new ConflictException(Messages.USER_EMAIL_ALREADY_EXIST);
      }
    }

    const otp: Otp = await this.generate(request);

    await this.mailerService.sendMail({
      to: request.email,
      subject: EmailSubjects.OTP_VERIFICATION,
      template: './otp',
      context: {
        otp: otp.code,
      },
    });

    return Promise.resolve({
      message: Messages.OTP_SENT,
      expiration: otp.expiresAt,
      otp: otp.code,
    });
  }

  async validateOtp(validateOtpDto: ValidateOtpDto): Promise<boolean> {
    const otp: OtpDocument | null = await this.otpModel.findOne({
      email: validateOtpDto.email,
      type: validateOtpDto.type,
    });

    if (!otp) return false;

    const date = new Date(validateOtpDto.date);

    const expiresAt = new Date(otp.expiresAt);

    if (expiresAt < date) {
      return false;
    }

    return true;
  }

  async validateOtpCode(request: ValidateOtpRequestDto): Promise<ResponseDto> {
    const userExist: boolean = await this.usersService.userExist(request.email);

    if (request.type == 'forgot-password') {
      if (!userExist) {
        throw new ConflictException(Messages.USER_NOT_FOUND);
      }
    }

    if (request.type == 'register') {
      if (userExist) {
        throw new ConflictException(Messages.USER_EMAIL_ALREADY_EXIST);
      }
    }

    const isValid: boolean = await this.validateOtp({
      email: request.email,
      type: request.type,
      date: request.date,
    });

    if (!isValid) {
      throw new ConflictException(Messages.OTP_ERROR);
    }

    return Promise.resolve({
      message: Messages.EMAIL_VERIFIED,
    });
  }

  async consumeOtp(email: string, type: string): Promise<void> {
    const record: OtpDocument | null = await this.otpModel.findOne({
      email,
      type,
    });

    if (!record) return;

    await this.otpModel.deleteOne({ _id: record._id });
  }
}
