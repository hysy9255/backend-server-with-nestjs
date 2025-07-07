import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { LoginInput, LoginOutput } from '../interface/dtos/Login.dto';
import { UserAuthService } from 'src/user/application/service/user.auth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userAuthService: UserAuthService,
  ) {}

  async login({ email, password }: LoginInput): Promise<LoginOutput> {
    const user = await this.userAuthService._getUser(email);
    await user.checkPassword(password);
    const token = this.jwtService.sign(user.id);
    return { token };
  }
}
