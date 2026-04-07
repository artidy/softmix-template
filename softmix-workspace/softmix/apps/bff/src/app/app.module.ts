import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';

import { ENV_FILE_PATH } from './const';
import { bffConfig } from '../config/bff.config';
import { validateEnvironments } from './env.validation';
import { CategoryModule } from './categories/category.module';
import { ProductModule } from './products/product.module';
import { UsersModule } from './users/users.module';
import { AlstyleModule } from './alstyle/alstyle.module';
import { UploaderModule } from './uploader/uploader.module';
import { CartModule } from './cart/cart.module';
import { AuthModule } from './auth/auth.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: ENV_FILE_PATH,
      load: [bffConfig],
      validate: validateEnvironments,
    }),
    CategoryModule,
    ProductModule,
    UploaderModule,
    UsersModule,
    AlstyleModule,
    CartModule,
    AuthModule,
  ]
})
export class AppModule {}
