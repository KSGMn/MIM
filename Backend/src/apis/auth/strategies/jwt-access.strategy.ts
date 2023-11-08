// jwt-access.strategy.ts

import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { Cache } from 'cache-manager';

export class JwtAccessStrategy extends PassportStrategy(Strategy, 'access') {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.ACCESS_PASSWORD,
      passReqToCallback: true,
    });
  }

  async validate(req, payload) {
    const accessToken = req.headers.authorization.replace('Bearer ', '');

    const accessTokenValue = await this.cacheManager.get(
      `accessToken:${accessToken}`,
    );

    console.log(accessToken);
    console.log(`저장된 토큰: ${accessTokenValue}`);

    console.log(payload); // { sub: askljdfklj-128930djk }

    if (accessTokenValue) {
      throw new UnauthorizedException('Invalid token');
    }
    return {
      id: payload.sub,
      email: payload.email,
      name: payload.name,
    };
  }
}
