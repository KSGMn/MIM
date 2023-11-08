// auth.service.ts

import {
  Inject,
  Injectable,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/user.service';
import {
  IAuthServiceGetAccessToken,
  IAuthServiceLogin,
} from './interfaces/auth-service.interface';
import * as bcrypt from 'bcrypt';
import * as jwt from 'jsonwebtoken';
import { Cache } from 'cache-manager';
import { CACHE_MANAGER } from '@nestjs/cache-manager';

@Injectable()
export class AuthService {
  constructor(
    @Inject(CACHE_MANAGER) private readonly cacheManager: Cache,

    private readonly jwtService: JwtService, //

    private readonly usersService: UsersService,
  ) {}

  async login({
    email,
    password,
    context,
  }: IAuthServiceLogin): Promise<string> {
    // 1. 이메일이 일치하는 유저를 DB에서 찾기
    const user = await this.usersService.findOneByEmail({ email });

    // 2. 일치하는 유저가 없으면?! 에러 던지기!!!
    if (!user) throw new UnprocessableEntityException('이메일이 없습니다.');

    // 3. 일치하는 유저가 있지만, 비밀번호가 틀렸다면?!
    const isAuth = await bcrypt.compare(password, user.password);
    if (!isAuth) throw new UnprocessableEntityException('암호가 틀렸습니다.');

    // 4. refreshToken(=JWT)을 만들어서 브라우저 쿠키에 저장해서 보내주기
    this.setRefreshToken({ user, context });

    // 5. 일치하는 유저도 있고, 비밀번호도 맞았다면?!
    //    => accessToken(=JWT)을 만들어서 브라우저에 전달하기
    return this.getAccessToken({ user });
  }

  async Logout({ context }) {
    // const refreshToken = context.req.headers.cookie.replace(
    //   'refreshToken=',
    //   '',
    // );
    const jwtToken = context.req.headers.authorization.replace('Bearer ', '');

    // console.log(`jwt토큰:${jwtToken}`, `ref토큰:${refreshToken}`);
    if (jwtToken) {
      const decodedAccessToken = jwt.verify(
        jwtToken,
        process.env.ACCESS_PASSWORD,
      ) as jwt.JwtPayload;

      await this.cacheManager.set(
        `accessToken:${jwtToken}`,
        jwtToken,
        decodedAccessToken.exp,
      );

      try {
        const accessTokenValue = await this.cacheManager.get(
          `accessToken:${jwtToken}`,
        );

        return '로그아웃 성공';
      } catch (error) {
        throw new UnauthorizedException('Invalid token');
      }
    } else {
      // 세션에서 토큰이 없는 경우 처리
      throw new UnauthorizedException('Token not found');
    }
  }

  restoreAccessToken({ user }: any): string {
    return this.getAccessToken({ user });
  }

  setRefreshToken({ user, context }: any): void {
    const refreshToken = this.jwtService.sign(
      { sub: user.id },
      { secret: process.env.REFRESH_PASSWORD, expiresIn: '2w' },
    );

    // 개발환경
    context.res.setHeader(
      'set-Cookie',
      `refreshToken=${refreshToken}; path=/;`,
    );

    // 배포환경
    // context.res.setHeader('set-Cookie', `refreshToken=${refreshToken}; path=/; domain=.mybacksite.com; SameSite=None; Secure; httpOnly`);
    // context.res.setHeader('Access-Control-Allow-Origin', 'https://myfrontsite.com');
  }

  getAccessToken({ user }: IAuthServiceGetAccessToken): string {
    return this.jwtService.sign(
      { sub: user.id, email: user.email, name: user.name },
      { secret: process.env.ACCESS_PASSWORD, expiresIn: '1h' },
    );
  }
}
