import { NestFactory } from '@nestjs/core';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ValidationPipe, Logger } from '@nestjs/common';
import { AppModule } from './app.module';
import * as cors from 'cors';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { logger: new Logger() });
  app.useGlobalPipes(new ValidationPipe());
  app.enableCors();
  app.use(cors());
  const config = new DocumentBuilder()
    .setTitle('My First Project')
    .setDescription('The Node First Project API description')
    .setVersion('1.0')
    .addBearerAuth({
      name: 'Authorization',
      type: 'apiKey',
      in: 'header',
      description: 'JWT authorization of an API',
    })
    .addServer(`${process.env.SWAGGER_BASEPATH}`)
    .build();

  const document = SwaggerModule.createDocument(app, config);
  document.security = [{ bearerAuth: [] }];
  const loginEndpoint = document.paths['/auth/login'];
  if (loginEndpoint) {
    loginEndpoint.post.security = [];
  }
  SwaggerModule.setup('/api/v1/admin/swagger-ui/index.html', app, document);
  app.setGlobalPrefix(process.env.BASE_PATH);
  const port = process.env.PORT || 3000;
  await app.listen(port);
}
bootstrap();
