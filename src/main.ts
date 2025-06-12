import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserService } from './user/application/service/user.service';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const userService = app.get(UserService);

  app.use((req, res, next) => {
    req['userService'] = userService;
    next();
  });

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
