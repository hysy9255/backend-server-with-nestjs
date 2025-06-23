import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { UserAuthService } from './user/application/service/user-auth.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const userAuthService = app.get(UserAuthService);

  app.use((req, res, next) => {
    req['userAuthService'] = userAuthService;
    next();
  });

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
