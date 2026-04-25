import { Injectable } from '@nestjs/common';
import { EncryptionService } from '@project-lib/core';
import { MailSettingsApi } from '@project-lib/shared-types';

import { UpdateMailSettingsDto } from './dto/update-mail-settings.dto';
import {
  MailSettingsRecord,
  MailSettingsRepository,
} from './mail-settings.repository';

export interface DecryptedMailSettings {
  enabled: boolean;
  host: string;
  port: number;
  secure: boolean;
  user: string;
  password: string;
  fromAddress: string;
  adminEmail: string;
  shopName: string;
  shopUrl: string;
}

@Injectable()
export class MailSettingsService {
  constructor(
    private readonly repository: MailSettingsRepository,
    private readonly encryption: EncryptionService,
  ) {}

  public async getCurrent(): Promise<MailSettingsApi> {
    const record = await this.repository.findCurrent();
    if (!record) return this.emptyApi();
    return this.toApi(record);
  }

  public async update(dto: UpdateMailSettingsDto, updatedBy: string): Promise<MailSettingsApi> {
    const existing = await this.repository.findCurrent();

    const user = this.prepareSecret(dto.user, existing?.user);
    const password = this.prepareSecret(dto.password, existing?.password);

    const record = await this.repository.upsert({
      enabled: dto.enabled,
      host: dto.host,
      port: dto.port,
      secure: dto.secure,
      user,
      password,
      fromAddress: dto.fromAddress,
      adminEmail: dto.adminEmail,
      shopName: dto.shopName,
      shopUrl: dto.shopUrl,
      updatedBy,
    });

    return this.toApi(record);
  }

  public async getDecrypted(): Promise<DecryptedMailSettings | null> {
    const record = await this.repository.findCurrent();
    if (!record) return null;

    return {
      enabled: record.enabled,
      host: record.host,
      port: record.port,
      secure: record.secure,
      user: record.user ? this.encryption.decrypt(record.user) : '',
      password: record.password ? this.encryption.decrypt(record.password) : '',
      fromAddress: record.fromAddress,
      adminEmail: record.adminEmail,
      shopName: record.shopName,
      shopUrl: record.shopUrl,
    };
  }

  private prepareSecret(
    incoming: string | undefined,
    existingEncrypted: string | undefined,
  ): string | undefined {
    if (incoming === undefined) return undefined;
    if (incoming === '' || incoming === EncryptionService.MASKED_VALUE) {
      return existingEncrypted ?? '';
    }
    return this.encryption.encrypt(incoming);
  }

  private toApi(record: MailSettingsRecord): MailSettingsApi {
    return {
      enabled: record.enabled,
      host: record.host,
      port: record.port,
      secure: record.secure,
      user: record.user ? EncryptionService.MASKED_VALUE : '',
      password: record.password ? EncryptionService.MASKED_VALUE : '',
      fromAddress: record.fromAddress,
      adminEmail: record.adminEmail,
      shopName: record.shopName,
      shopUrl: record.shopUrl,
      hasUser: Boolean(record.user),
      hasPassword: Boolean(record.password),
      updatedBy: record.updatedBy,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private emptyApi(): MailSettingsApi {
    return {
      enabled: false,
      host: '',
      port: 587,
      secure: false,
      user: '',
      password: '',
      fromAddress: '',
      adminEmail: '',
      shopName: 'Softmix',
      shopUrl: '',
      hasUser: false,
      hasPassword: false,
    };
  }
}
