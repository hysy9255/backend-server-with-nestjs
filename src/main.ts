import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserAuthService } from './user/application/service/user-auth.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // DTO에 정의되지 않은 값 제거
      forbidNonWhitelisted: true, // 정의되지 않은 값이 오면 에러
      transform: true, // 요청을 DTO 인스턴스로 자동 변환
    }),
  );

  const userAuthService = app.get(UserAuthService);

  // app.use((req, res, next) => {
  //   req['userAuthService'] = userAuthService;
  //   next();
  // });

  if (process.env.NODE_ENV !== 'production') {
    const config = new DocumentBuilder()
      .setTitle('My App API')
      .setDescription('API documentation')
      .setVersion('1.0')
      // .addBearerAuth()
      .addApiKey(
        { type: 'apiKey', name: 'jwt-token', in: 'header' },
        'jwt-token', // name for the security scheme
      )
      .build();

    const document = SwaggerModule.createDocument(app, config);
    SwaggerModule.setup('api-docs', app, document);
  }

  await app.listen(process.env.PORT ?? 3002);
}
bootstrap();
