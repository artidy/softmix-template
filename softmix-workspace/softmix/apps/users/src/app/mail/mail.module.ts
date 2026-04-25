import { forwardRef, Module } from '@nestjs/common';

import { MailSettingsModule } from '../mail-settings/mail-settings.module';
import { MailService } from './mail.service';

@Module({
  imports: [forwardRef(() => MailSettingsModule)],
  providers: [MailService],
  exports: [MailService],
})
export class MailModule {}
