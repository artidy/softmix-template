import { forwardRef, Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { EncryptionModule } from '@project-lib/core';

import { MailModule } from '../mail/mail.module';
import { MailSettingsController } from './mail-settings.controller';
import { MailSettingsModel, MailSettingsSchema } from './mail-settings.model';
import { MailSettingsRepository } from './mail-settings.repository';
import { MailSettingsService } from './mail-settings.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: MailSettingsModel.name, schema: MailSettingsSchema },
    ]),
    EncryptionModule,
    forwardRef(() => MailModule),
  ],
  controllers: [MailSettingsController],
  providers: [MailSettingsService, MailSettingsRepository],
  exports: [MailSettingsService],
})
export class MailSettingsModule {}
