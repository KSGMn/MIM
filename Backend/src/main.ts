import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import { HttpExceptionFilter } from './commons/filter/http-exception.filter';
import { ExpressAdapter } from '@nestjs/platform-express';
import * as express from 'express';
import { graphqlUploadExpress } from 'graphql-upload';

async function bootstrap() {
  const server = express();
  const app = await NestFactory.create(AppModule, new ExpressAdapter(server));
  app.useGlobalPipes(new ValidationPipe()); //@Min적용
  app.useGlobalFilters(new HttpExceptionFilter());
  app.use(graphqlUploadExpress());

  app.enableCors({
    origin: 'http://localhost:3000', // 클라이언트의 주소
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true, // 필요한 경우 헤더에 인증 정보를 포함
  });

  await app.listen(4001);
}
bootstrap();
