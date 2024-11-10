import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import helmet from 'helmet';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { JwtAccessAuthGuard } from './auth/guards/jwt-access-auth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // Swagger
  const swaggerConfig = new DocumentBuilder()
    .setTitle('Backend Skeleton')
    .setDescription('This is a backend skeleton for a any application')
    .setVersion('1.0')
    .addTag('backend-skeleton')
    .build();

  const swaggerDocument = SwaggerModule.createDocument(app, swaggerConfig);

  SwaggerModule.setup('api', app, swaggerDocument, {
    jsonDocumentUrl: '/api-json'
  });

  // Helmet
  app.use(helmet());

  // Validation
  app.useGlobalPipes(new ValidationPipe({}));

  // Global Auth Guard
  app.useGlobalGuards(new JwtAccessAuthGuard(app.get(Reflector)));

  // Cookie Parser
  app.use(cookieParser());

  // Static Assets
  app.useStaticAssets(join(__dirname, '..', 'uploaded-files'), {
    prefix: '/uploaded-files/',
  });

  // Run
  await app.listen(process.env.PORT ?? 3621);
}

bootstrap();
