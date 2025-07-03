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
import { UserAuthService } from 'src/user/application/service/user.auth.service';
import { UserRole } from 'src/constants/userRole';

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

        if (user.role === UserRole.Owner) {
          req['userInfo'] = await this.userAuthService._getOwnerInfo(user.id);
        } else if (user.role === UserRole.Client) {
          req['userInfo'] = await this.userAuthService._getClientInfo(user.id);
        } else if (user.role === UserRole.Driver) {
          req['userInfo'] = await this.userAuthService._getDriverInfo(user.id);
        }
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
