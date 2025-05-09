import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthResolver } from './auth.resolver';
import { AuthController } from './auth.controller';
import { UserModule } from 'src/user/user.module';
import { JwtModule } from 'src/jwt/jwt.module';

@Module({
  imports: [UserModule, JwtModule],
  providers: [AuthService, AuthResolver],
  controllers: [AuthController],
  exports: [AuthService],
})
export class AuthModule {}
