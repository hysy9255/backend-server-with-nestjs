import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/application/service/user.service';
import { UserAuthService } from './user/application/service/user-auth.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const userAuthService = app.get(UserAuthService);

  app.use((req, res, next) => {
    req['userAuthService'] = userAuthService;
    next();
  });

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
