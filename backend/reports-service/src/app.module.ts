import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Report, ReportSchema } from './models/report.model';
import { JwtModule } from '@nestjs/jwt';
import { HttpModule } from '@nestjs/axios';
import { ReportsController } from './controllers/reports.controller';
import { ReportsService } from './services/reports.service';
import { UserService } from './services/user.service';
import { AwsS3Service } from './services/aws-s3.service';
import { JwtStrategy } from './security/jwt.strategy';
import { PassportModule } from '@nestjs/passport';
import { UsersService } from './services/users.service';
import { RolesService } from './services/roles.service';

@Module({
  imports: [
    HttpModule,
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    MongooseModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        uri: configService.get<string>('MONGODB_URI'),
      }),
    }),
    MongooseModule.forFeature([{ name: Report.name, schema: ReportSchema }]),
    JwtModule.registerAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        secret: configService.get<string>('JWT_SECRET'),
        signOptions: {
          expiresIn: configService.get<string>('JWT_EXPIRES_IN'),
          issuer: configService.get<string>('JWT_ISSUER'),
          audience: configService.get<string>('JWT_AUDIENCE')?.split(','),
        },
      }),
    }),
    PassportModule,
  ],
  controllers: [ReportsController],
  providers: [
    JwtStrategy,
    ReportsService,
    RolesService,
    UsersService,
    UserService,
    AwsS3Service,
  ],
})
export class AppModule {}
