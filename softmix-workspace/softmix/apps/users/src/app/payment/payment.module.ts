import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { MongooseModule } from '@nestjs/mongoose';

import { OrderModule } from '../order/order.module';
import { NotificationModule } from '../notifications/notification.module';
import { PaymentSettingsModule } from '../payment-settings/payment-settings.module';
import { MailSettingsModule } from '../mail-settings/mail-settings.module';
import { PaymentController } from './payment.controller';
import { PaymentService } from './payment.service';
import { PaymentTransactionModel, PaymentTransactionSchema } from './payment-transaction.model';
import { PaymentTransactionRepository } from './payment-transaction.repository';
import { FreedomPayProvider } from './providers/freedom-pay.provider';
import { MockPaymentProvider } from './providers/mock.provider';

@Module({
  imports: [
    HttpModule,
    MongooseModule.forFeature([
      { name: PaymentTransactionModel.name, schema: PaymentTransactionSchema },
    ]),
    OrderModule,
    NotificationModule,
    PaymentSettingsModule,
    MailSettingsModule,
  ],
  controllers: [PaymentController],
  providers: [PaymentService, PaymentTransactionRepository, FreedomPayProvider, MockPaymentProvider],
  exports: [PaymentService],
})
export class PaymentModule {}
