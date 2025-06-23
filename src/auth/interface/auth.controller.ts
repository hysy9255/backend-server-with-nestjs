import { Body, Controller, Post } from '@nestjs/common';

import { AuthService } from '../application/auth.service';
import { LoginInput, LoginOutput } from './dtos/Login.dto';
import { Role } from '../role.decorator';
import { ApiBody, ApiOperation, ApiResponse } from '@nestjs/swagger';

@Controller('api/auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @ApiOperation({ summary: '[Any] User login' })
  @ApiBody({ type: LoginInput })
  @ApiResponse({ type: LoginOutput })
  @Post('login')
  @Role(['Any'])
  login(@Body() loginInput: LoginInput): Promise<LoginOutput> {
    return this.authService.login(loginInput);
  }
}
