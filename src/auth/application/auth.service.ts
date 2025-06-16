import { Injectable, NotFoundException } from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { LoginInput, LoginOutput } from '../interface/dtos/Login.dto';
import { UserAuthService } from 'src/user/application/service/user-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userAuthService: UserAuthService,
  ) {}

  // used
  async login(loginInput: LoginInput): Promise<LoginOutput> {
    const user = await this.userAuthService.getUserForAuthByEmail(
      loginInput.email,
    );

    if (!user) throw new NotFoundException('User Not Found');

    await user.checkPassword(loginInput.password);

    const token = this.jwtService.sign(user.id);

    return { token };
  }
}
