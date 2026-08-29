// 1. Initialize OpenTelemetry tracing SDK before other modules load
import { otelSDK } from './otel';
otelSDK.start();

import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import helmet from 'helmet';
import compression from 'compression';
import rateLimit from 'express-rate-limit';
import { Logger } from 'nestjs-pino';
import { AppModule } from './app.module';
import { GlobalExceptionFilter, ResponseTransformInterceptor } from '@eduverse/shared';
import { validateEnv } from './config/env.config';

async function bootstrap() {
  validateEnv();
  const app = await NestFactory.create(AppModule, { bufferLogs: true });

  // Enable trusted proxy
  const expressApp = app.getHttpAdapter().getInstance();
  expressApp.set('trust proxy', 1);

  // Response compression
  app.use(compression());

  // Use custom structured logger
  const pinoLogger = app.get(Logger);
  app.useLogger(pinoLogger);

  // Security Headers
  app.use(helmet());

  // Global Rate Limiting
  app.use(
    rateLimit({
      windowMs: (Number(process.env.RATE_LIMIT_TTL) || 60) * 1000,
      limit: Number(process.env.RATE_LIMIT_LIMIT) || 100,
      message: 'Too many requests from this IP, please try again later.',
    })
  );

  // Targeted Throttling
  app.use(
    '/api/v1/public/search',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 30,
      message: 'Too many search requests, please try again later.',
    })
  );

  app.use(
    '/api/v1/public/reviews',
    rateLimit({
      windowMs: 15 * 60 * 1000,
      limit: 10,
      message: 'Too many review requests, please try again later.',
    })
  );

  app.use(
    '/api/v1/auth/register',
    rateLimit({
      windowMs: 60 * 60 * 1000,
      limit: 5,
      message: 'Too many registration attempts, please try again later.',
    })
  );

  app.use(
    '/api/v1/auth/otp',
    rateLimit({
      windowMs: 10 * 60 * 1000,
      limit: 5,
      message: 'Too many OTP requests, please try again later.',
    })
  );

  // CORS Configuration
  app.enableCors({
    origin: [
      process.env.FRONTEND_WEB_URL || 'http://localhost:3000',
      process.env.FRONTEND_ADMIN_URL || 'http://localhost:3001',
    ],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
  });

  // Global Prefix
  const prefix = process.env.API_PREFIX || 'api/v1';
  app.setGlobalPrefix(prefix);

  // Validation Pipeline
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      forbidNonWhitelisted: true,
    })
  );

  // Global Envelopes (Success & Error formatting)
  app.useGlobalFilters(new GlobalExceptionFilter());
  app.useGlobalInterceptors(new ResponseTransformInterceptor());

  // Swagger Documentation Setup
  const config = new DocumentBuilder()
    .setTitle('EduVerse REST API')
    .setDescription('Enterprise-grade API engine for the EduVerse Educational Platform')
    .setVersion('1.0.0')
    .addBearerAuth()
    .build();
  
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup(`${prefix}/docs`, app, document);

  const port = process.env.PORT || 4000;
  await app.listen(port);
  pinoLogger.log(`EduVerse Core Engine is active and listening on port ${port}`);
}

bootstrap().catch((err) => {
  console.error('Core Engine crash during boot sequence:', err);
  process.exit(1);
});
