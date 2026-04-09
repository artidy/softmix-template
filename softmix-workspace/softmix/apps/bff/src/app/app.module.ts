import { MiddlewareConsumer, Module, NestModule } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { HttpModule, HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { authConfig, auth } from '@project-lib/core';

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
import { SettingsModule } from './settings/settings.module';
import { ExternalServicesModule } from './external-services/external-services.module';
import { ServiceProxyModule } from './service-proxy/service-proxy.module';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: ENV_FILE_PATH,
      load: [bffConfig, authConfig],
      validate: validateEnvironments,
    }),
    HttpModule,
    CategoryModule,
    ProductModule,
    UploaderModule,
    UsersModule,
    AlstyleModule,
    CartModule,
    AuthModule,
    SettingsModule,
    ExternalServicesModule,
    ServiceProxyModule,
  ]
})
export class AppModule implements NestModule {
  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {}

  configure(consumer: MiddlewareConsumer) {
    consumer
      .apply(auth(this.httpService, this.configService))
      .forRoutes('*');
  }
}
