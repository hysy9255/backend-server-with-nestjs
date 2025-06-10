import {
  HttpException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';

import { JwtService } from 'src/jwt/jwt.service';
import { LoginInput, LoginOutput } from './dtos/Login.dto';
import { UserService } from 'src/user/user.service';
import { ERROR_MESSAGES } from 'src/constants/errorMessages';
import { UserMapper } from 'src/user/mapper/user.mapper';

@Injectable()
export class AuthService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly userService: UserService,
  ) {}

  // used
  async login(loginInput: LoginInput): Promise<LoginOutput> {
    try {
      const user = UserMapper.toDomain(
        await this.userService.findUserByEmail(loginInput.email),
      );

      await user.checkPassword(loginInput.password);

      const token = this.jwtService.sign(user.id);

      return { token };
    } catch (e) {
      console.error(e);
      throw new InternalServerErrorException(ERROR_MESSAGES.LOG_IN_FAILED);
    }
  }
}
