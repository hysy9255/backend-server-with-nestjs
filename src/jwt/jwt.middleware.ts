import { Injectable, NestMiddleware } from '@nestjs/common';
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
        console.log('token: ', token);
        const decoded = this.jwtService.verify(token.toString());
        console.log('decoded: ', decoded);
        const user = await this.userService.findUserById(decoded['id']);
        console.log('user: ', user);
        if (user) {
          req['user'] = user;
        }
      }
    } catch (e) {
      console.error('JWT Middleware Error:', e);
    }

    next();
  }
}
