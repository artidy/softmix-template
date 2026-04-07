import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { ServeStaticModule } from '@nestjs/serve-static';
import { getMongoDbOptions, mongodbConfig } from '@project-lib/core';
import { ASSETS_DIRECTORY } from '@project-lib/shared-types';

import { validateEnvironments } from './env.validation';
import { getFullPathDirectory } from './helpers';
import { ENV_FILE_PATH } from './app.constant';
import { ProductImageModule } from './products/product-image.module';
import { HttpModule } from '@nestjs/axios';
import { getHttpOptions } from '../../../shop/src/config/http.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: ENV_FILE_PATH,
      load: [ mongodbConfig ],
      validate: validateEnvironments,
    }),
    MongooseModule.forRootAsync(
      getMongoDbOptions()
    ),
    ServeStaticModule.forRoot({
      rootPath: getFullPathDirectory(''),
      serveRoot: `/${ASSETS_DIRECTORY}/`,
      exclude: ['/api*'],
    }),
    HttpModule.registerAsync(getHttpOptions()),
    ProductImageModule,
  ]
})
export class AppModule {}
