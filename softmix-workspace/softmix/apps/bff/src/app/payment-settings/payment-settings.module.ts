import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { PaymentSettingsBffController } from './payment-settings.controller';
import { PaymentSettingsBffService } from './payment-settings.service';

@Module({
  imports: [HttpModule],
  controllers: [PaymentSettingsBffController],
  providers: [PaymentSettingsBffService],
})
export class PaymentSettingsBffModule {}
