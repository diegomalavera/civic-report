import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from './models/role.model';
import { JwtModule } from '@nestjs/jwt';
import { RolesService } from './services/roles.service';
import { RolesController } from './controllers/roles.controller';
import { HttpModule } from '@nestjs/axios';
import { UsersService } from './services/users.service';
import { JwtStrategy } from './security/jwt.strategy';
import { PassportModule } from '@nestjs/passport';

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
    MongooseModule.forFeature([{ name: Role.name, schema: RoleSchema }]),
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
  controllers: [RolesController],
  providers: [JwtStrategy, UsersService, RolesService],
})
export class AppModule {}
