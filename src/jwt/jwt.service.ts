import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as jwt from 'jsonwebtoken';

@Injectable()
export class JwtService {
  private readonly privateKey: string;

  constructor(private configService: ConfigService) {
    const key = this.configService.get<string>('JWT_PRIVATE_KEY');
    if (!key) {
      throw new InternalServerErrorException(
        'JWT_PRIVATE_KEY is not defined in the environment variables',
      );
    }
    this.privateKey = key;
  }

  sign(userId: string): string {
    return jwt.sign({ id: userId }, this.privateKey);
  }
  verify(token: string) {
    return jwt.verify(token, this.privateKey);
  }
}
