import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MailSettingsBffController } from './mail-settings.controller';
import { MailSettingsBffService } from './mail-settings.service';

@Module({
  imports: [HttpModule],
  controllers: [MailSettingsBffController],
  providers: [MailSettingsBffService],
})
export class MailSettingsBffModule {}
