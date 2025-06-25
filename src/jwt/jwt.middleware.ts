import {
  HttpException,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JWT_HEADER } from 'src/constants/header';
import { JwtService } from './jwt.service';
import { UserAuthService } from 'src/user/application/service/user-auth.service';

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userAuthService: UserAuthService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers[JWT_HEADER];

    try {
      if (token) {
        let decoded;

        try {
          decoded = this.jwtService.verify(token.toString());
        } catch (e) {
          throw new UnauthorizedException('Invalid Token');
        }

        const user = await this.userAuthService.findUserForMiddlewareById(
          decoded['id'],
        );

        if (!user) {
          // console.warn(
          //   `[JWT Middleware] No user found for decoded ID: ${decoded['id']}`,
          // );
          throw new UnauthorizedException('Unauthorized');
        }

        // console.log('user from middleware:', user);

        req['user'] = user;
      }
    } catch (e) {
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException('Authentication failed');
    }

    next();
  }
}
