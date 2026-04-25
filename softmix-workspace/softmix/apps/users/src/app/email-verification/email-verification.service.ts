import { Injectable, Logger } from '@nestjs/common';
import { randomBytes } from 'crypto';
import { User } from '@project-lib/shared-types';

import { MailService } from '../mail/mail.service';
import { MailSettingsService } from '../mail-settings/mail-settings.service';
import { EmailVerificationRepository } from './email-verification.repository';

const TOKEN_TTL_MS = 24 * 60 * 60 * 1000;
const FALLBACK_SHOP_URL = 'http://localhost:4200';

export type VerifyTokenResult =
  | { ok: true; userId: string }
  | { ok: false; reason: 'NOT_FOUND' | 'EXPIRED' | 'USED' };

@Injectable()
export class EmailVerificationService {
  private readonly logger = new Logger(EmailVerificationService.name);

  constructor(
    private readonly repository: EmailVerificationRepository,
    private readonly mailService: MailService,
    private readonly mailSettingsService: MailSettingsService,
  ) {}

  public async issueAndSend(user: User): Promise<void> {
    if (!user._id || !user.email) return;

    await this.repository.invalidateActiveForUser(user._id);

    const token = randomBytes(32).toString('hex');
    const expiresAt = new Date(Date.now() + TOKEN_TTL_MS);
    await this.repository.create({ userId: user._id, token, expiresAt });

    const url = await this.buildUrl(token);

    try {
      await this.mailService.sendEmailVerification(user.email, user.name, url);
    } catch (error) {
      this.logger.error('Не удалось отправить письмо верификации', error as Error);
    }
  }

  public async verifyToken(token: string): Promise<VerifyTokenResult> {
    const record = await this.repository.findByToken(token);
    if (!record) {
      return { ok: false, reason: 'NOT_FOUND' };
    }
    if (record.usedAt) {
      return { ok: false, reason: 'USED' };
    }
    if (record.expiresAt.getTime() < Date.now()) {
      return { ok: false, reason: 'EXPIRED' };
    }

    await this.repository.markUsed(record.id);
    return { ok: true, userId: record.userId };
  }

  private async buildUrl(token: string): Promise<string> {
    const settings = await this.mailSettingsService.getDecrypted();
    const publicUrl = settings?.shopUrl || FALLBACK_SHOP_URL;
    const trimmed = publicUrl.replace(/\/$/, '');
    return `${trimmed}/api/auth/verify-email?token=${token}`;
  }
}
