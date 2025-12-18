import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: process.env.JWT_SECRET ?? 'secretkey',
    });
  }

  async validate(payload: any) {
    if (!payload?.id || !payload?.email) {
      throw new UnauthorizedException('Invalid token');
    }

    return {
      id: payload.id,
      email: payload.email,
      role: payload.role,
    };
  }
}
