import { Injectable, InternalServerErrorException } from '@nestjs/common';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  sign(userId: string): string {
    return jwt.sign({ id: userId }, 'this.options.privateKey');
  }
  verify(token: string) {
    return jwt.verify(token, 'this.options.privateKey');
  }
}
