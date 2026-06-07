import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api/v1');

  const allowOrigin = process.env.NODE_ENV === 'production'
    ? (process.env.FRONTEND_URL ?? 'http://localhost:5173')
    : true;

  app.enableCors({
    origin: allowOrigin,
    credentials: true,
  });

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  const port = process.env.PORT ?? 3001;
  await app.listen(port);

  console.log(`Server running on http://localhost:${port}/api/v1`);
}

bootstrap();
