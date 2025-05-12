import { Module } from '@nestjs/common';
import { JwtService } from './jwt.service';
import { JwtMiddleWare } from './jwt.middleware';
import { UserModule } from 'src/user/user.module';

@Module({
  imports: [UserModule],
  providers: [JwtService, JwtMiddleWare],
  exports: [JwtService],
})
export class JwtModule {}
