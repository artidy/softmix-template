import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { Logger, ValidationPipe } from '@nestjs/common';
import { json, urlencoded } from 'express';

import { BootstrapFunction } from './bootstrap-function.interface';
import { DEFAULT_PORT, GLOBAL_PREFIX } from './lib.const';
import { HttpExceptionFilter } from './exceptions/http.exception-filter';

export async function bootstrap(module, serviceName: string, ...cbs: BootstrapFunction[]) {
  const app = await NestFactory.create(module);
  const port = process.env.PORT || DEFAULT_PORT;

  app.use(json({ limit: '10mb' }));
  app.use(urlencoded({ extended: true, limit: '10mb' }));
  app.setGlobalPrefix(GLOBAL_PREFIX);

  // CORS configuration with security
  const allowedOrigins = process.env.ALLOWED_ORIGINS
    ? process.env.ALLOWED_ORIGINS.split(',').map(origin => origin.trim())
    : ['http://localhost:4200', 'http://localhost:3000'];

  app.enableCors({
    origin: allowedOrigins,
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    exposedHeaders: ['Content-Range', 'X-Content-Range'],
    maxAge: 600, // 10 minutes
  });

  const config = new DocumentBuilder()
    .setTitle(`The ${serviceName} service`)
    .setDescription(`${serviceName} service API`)
    .setVersion('1.0')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('spec', app, document);

  app.useGlobalPipes(new ValidationPipe({ transform: true }));
  app.useGlobalFilters(new HttpExceptionFilter());
  app.enableShutdownHooks();

  for (const cb of cbs) {
    cb(app);
  }

  await app.listen(port);

  Logger.log(
    `🚀 Application ${serviceName} is running on: http://localhost:${port}/${GLOBAL_PREFIX}`
  );
}
