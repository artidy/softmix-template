import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { MailModule } from '../mail/mail.module';
import { MailSettingsModule } from '../mail-settings/mail-settings.module';
import { NotificationService } from './notification.service';
import { TelegramChannel } from './providers/telegram.channel';
import { WhatsAppChannel } from './providers/whatsapp.channel';

@Module({
  imports: [HttpModule, MailModule, MailSettingsModule],
  providers: [NotificationService, WhatsAppChannel, TelegramChannel],
  exports: [NotificationService],
})
export class NotificationModule {}
