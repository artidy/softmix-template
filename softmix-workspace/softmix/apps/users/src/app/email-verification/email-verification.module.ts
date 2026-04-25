import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { MailModule } from '../mail/mail.module';
import { MailSettingsModule } from '../mail-settings/mail-settings.module';
import { EmailVerificationModel, EmailVerificationSchema } from './email-verification.model';
import { EmailVerificationRepository } from './email-verification.repository';
import { EmailVerificationService } from './email-verification.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: EmailVerificationModel.name, schema: EmailVerificationSchema },
    ]),
    MailModule,
    MailSettingsModule,
  ],
  providers: [EmailVerificationService, EmailVerificationRepository],
  exports: [EmailVerificationService],
})
export class EmailVerificationModule {}
