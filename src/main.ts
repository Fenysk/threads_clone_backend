import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app.enableCors({
    origin: true,
    credentials: true
  });

  app.useGlobalPipes(new ValidationPipe({}));

  app.use(cookieParser());

  app.useStaticAssets(join(__dirname, '..', 'uploaded-files'), {
    prefix: '/uploaded-files/',
  });

  await app.listen(process.env.PORT ?? 3621);
}
bootstrap();
