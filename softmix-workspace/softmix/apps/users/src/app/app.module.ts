import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { getMongoDbOptions, mongodbConfig } from '@project-lib/core';

import { ENV_FILE_PATH } from './app.constant';
import { jwtConfig } from '../config/jwt.config';
import { notificationsConfig } from '../config/notifications.config';
import { validateEnvironments } from './env.validation';
import { RefreshTokenModule } from './refresh-token/refresh-token.module';
import { UserModule } from './user/user.module';
import { AuthModule } from './auth/auth.module';
import { CartModule } from './cart/cart.module';
import { OrderModule } from './order/order.module';
import { MailModule } from './mail/mail.module';
import { MailSettingsModule } from './mail-settings/mail-settings.module';
import { NotificationModule } from './notifications/notification.module';
import { EmailVerificationModule } from './email-verification/email-verification.module';
import { PaymentModule } from './payment/payment.module';
import { PaymentSettingsModule } from './payment-settings/payment-settings.module';
import { userConfig } from '../config/user.config';

@Module({
  imports: [
    ConfigModule.forRoot({
      cache: true,
      isGlobal: true,
      envFilePath: ENV_FILE_PATH,
      load: [mongodbConfig, jwtConfig, userConfig, notificationsConfig],
      validate: validateEnvironments,
    }),
    MongooseModule.forRootAsync(
      getMongoDbOptions()
    ),
    RefreshTokenModule,
    UserModule,
    AuthModule,
    CartModule,
    MailSettingsModule,
    MailModule,
    NotificationModule,
    EmailVerificationModule,
    OrderModule,
    PaymentSettingsModule,
    PaymentModule,
  ]
})
export class AppModule {}
