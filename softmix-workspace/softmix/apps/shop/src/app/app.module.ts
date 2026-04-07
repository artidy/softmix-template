import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { HttpModule } from '@nestjs/axios';
import { authConfig } from '@project-lib/core';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ENV_FILE_PATH } from './app.constant';
import { getHttpOptions, httpConfig } from '../config/http.config';
import { validateEnvironments } from './env.validation';
import { getTypeOrmConfig, postgresConfig } from '../config/postgres.config';
import { CategoryModule } from './categories/category.module';
import { ProductModule } from './products/product.module';
import { SettingsModule } from './settings/settings.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: ENV_FILE_PATH,
      load: [httpConfig, authConfig, postgresConfig],
      validate: validateEnvironments,
    }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: getTypeOrmConfig,
    }),
    HttpModule.registerAsync(getHttpOptions()),
    CategoryModule,
    ProductModule,
    SettingsModule,
  ]
})
export class AppModule {}
