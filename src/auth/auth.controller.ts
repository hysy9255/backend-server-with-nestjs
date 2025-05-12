import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from './auth.service';
import { LoginInput, LoginOutput } from './dtos/Login.dto';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('login')
  login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
    return this.authService.login(loginInput);
  }
}
