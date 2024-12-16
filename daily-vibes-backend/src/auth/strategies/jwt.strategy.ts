import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { Request } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromExtractors([
        (req: Request) => {
          return req?.cookies['access_token'];
        },
      ]),
      ignoreExpiration: false,
      secretOrKey: 'test',
    });
  }

  async validate(payload: any) {
    return { userId: payload.userId, email: payload.email };
  }
}
