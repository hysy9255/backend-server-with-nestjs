import {
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { JwtService } from 'src/jwt/jwt.service';
import { LoginInput, LoginOutput } from '../interface/dtos/Login.dto';
import { ERROR_MESSAGES } from 'src/constants/errorMessages';
import { UserAuthService } from 'src/user/application/service/user-auth.service';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userAuthService: UserAuthService,
  ) {}

  // used
  async login(loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const user = await this.userAuthService.getUserForAuthByEmail(
        loginInput.email,
      );

      if (!user) throw new NotFoundException('User Not Found');

      await user.checkPassword(loginInput.password);

      const token = this.jwtService.sign(user.id);

      return { token };
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(ERROR_MESSAGES.LOG_IN_FAILED);
    }
  }
}
