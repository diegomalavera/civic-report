import { Injectable, UnauthorizedException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UserDto } from 'src/dtos';
import { Messages } from 'src/messages';
import { UsersService } from 'src/services/users.service';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(
    private readonly configService: ConfigService,
    private readonly usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('JWT_SECRET') || 'secretOrKey',
      ignoreExpiration: false,
      issuer: configService.get<string>('JWT_ISSUER'),
      audience: configService.get<string>('JWT_AUDIENCE')?.split(','),
    });
  }

  async validate(payload: any) {
    if (payload.internal) {
      return payload;
    }

    const user: UserDto = await this.usersService.findById(payload.sub);

    if (!user) {
      throw new UnauthorizedException(Messages.USER_NOT_EXITS);
    }

    if (!user.enabled) {
      throw new UnauthorizedException(Messages.USER_DISABLED);
    }

    return payload;
  }
}
