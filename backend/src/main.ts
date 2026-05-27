import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, Logger } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const logger = new Logger('Bootstrap');

  // 🔹 ИЗМЕНЕНИЕ: Настройка CORS (фронтенд на 5173)
  app.enableCors({
    origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'Accept'],
    credentials: true,
    optionsSuccessStatus: 204,
  });

  // 🔹 ИЗМЕНЕНИЕ: Валидация (whitelist: false, чтобы не обрезать поля DTO)
  app.useGlobalPipes(new ValidationPipe({
    whitelist: false,
    transform: true,
  }));

  const port = process.env.PORT || 3000;
  await app.listen(port, '0.0.0.0');
  logger.log(`🚀 Backend running on http://localhost:${port}`);
}
bootstrap();