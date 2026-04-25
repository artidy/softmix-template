import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EncryptionModule } from '@project-lib/core';

import { PaymentSettingsController } from './payment-settings.controller';
import { PaymentSettingsModel, PaymentSettingsSchema } from './payment-settings.model';
import { PaymentSettingsRepository } from './payment-settings.repository';
import { PaymentSettingsService } from './payment-settings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: PaymentSettingsModel.name, schema: PaymentSettingsSchema },
    ]),
    EncryptionModule,
  ],
  controllers: [PaymentSettingsController],
  providers: [PaymentSettingsService, PaymentSettingsRepository],
  exports: [PaymentSettingsService],
})
export class PaymentSettingsModule {}
