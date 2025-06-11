import {
  HttpException,
  Inject,
  Injectable,
  InternalServerErrorException,
  NestMiddleware,
  UnauthorizedException,
} from '@nestjs/common';
import { NextFunction, Request, Response } from 'express';
import { JWT_HEADER } from 'src/constants/header';
import { JwtService } from './jwt.service';
import { UserService } from 'src/user/user.service';

@Injectable()
export class JwtMiddleWare implements NestMiddleware {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  async use(req: Request, res: Response, next: NextFunction) {
    const token = req.headers[JWT_HEADER];

    try {
      if (token) {
        let decoded;

        try {
          decoded = this.jwtService.verify(token.toString());
        } catch (e) {
          throw new UnauthorizedException('Invalid token');
        }

        const user = await this.userService.findUserById(decoded['id']);

        if (!user) {
          throw new UnauthorizedException('User no longer exists');
        }

        req['user'] = user;
      }
    } catch (e) {
      console.error('JWT Middleware Error:', e);
      if (e instanceof HttpException) {
        throw e;
      }
      throw new InternalServerErrorException('Authentication failed');
    }

    next();
  }
}
