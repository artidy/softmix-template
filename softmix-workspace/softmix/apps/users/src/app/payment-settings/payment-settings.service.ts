import { Injectable, NotFoundException } from '@nestjs/common';
import { EncryptionService } from '@project-lib/core';
import { PaymentMethod, PaymentSettingsApi } from '@project-lib/shared-types';

import { UpdatePaymentSettingsDto } from './dto/update-payment-settings.dto';
import {
  PaymentSettingsRecord,
  PaymentSettingsRepository,
} from './payment-settings.repository';

const SUPPORTED_PROVIDERS: PaymentMethod[] = [
  PaymentMethod.FreedomPay,
  PaymentMethod.KaspiPay,
  PaymentMethod.HalykEpay,
];

export interface DecryptedPaymentSettings {
  provider: PaymentMethod;
  enabled: boolean;
  testMode: boolean;
  merchantId: string;
  secret: string;
  apiUrl: string;
  extra: Record<string, unknown>;
}

@Injectable()
export class PaymentSettingsService {
  constructor(
    private readonly repository: PaymentSettingsRepository,
    private readonly encryption: EncryptionService,
  ) {}

  public async listAll(): Promise<PaymentSettingsApi[]> {
    const records = await this.repository.findAll();
    const map = new Map(records.map((r) => [r.provider, r]));

    return SUPPORTED_PROVIDERS.map((provider) => {
      const record = map.get(provider);
      return record ? this.toApi(record) : this.emptyApi(provider);
    });
  }

  public async getOne(provider: PaymentMethod): Promise<PaymentSettingsApi> {
    this.assertSupported(provider);
    const record = await this.repository.findByProvider(provider);
    return record ? this.toApi(record) : this.emptyApi(provider);
  }

  public async update(
    provider: PaymentMethod,
    dto: UpdatePaymentSettingsDto,
    updatedBy: string,
  ): Promise<PaymentSettingsApi> {
    this.assertSupported(provider);

    const existing = await this.repository.findByProvider(provider);

    const merchantId = this.prepareSecret(dto.merchantId, existing?.merchantId);
    const secret = this.prepareSecret(dto.secret, existing?.secret);
    const extra = this.prepareSecret(dto.extra, existing?.extra);

    const record = await this.repository.upsert({
      provider,
      enabled: dto.enabled,
      testMode: dto.testMode,
      apiUrl: dto.apiUrl,
      merchantId,
      secret,
      extra,
      updatedBy,
    });

    return this.toApi(record);
  }

  public async getDecrypted(provider: PaymentMethod): Promise<DecryptedPaymentSettings | null> {
    const record = await this.repository.findByProvider(provider);
    if (!record) return null;

    let extra: Record<string, unknown> = {};
    if (record.extra) {
      try {
        const decryptedExtra = this.encryption.decrypt(record.extra);
        extra = decryptedExtra ? (JSON.parse(decryptedExtra) as Record<string, unknown>) : {};
      } catch {
        extra = {};
      }
    }

    return {
      provider: record.provider,
      enabled: record.enabled,
      testMode: record.testMode,
      apiUrl: record.apiUrl ?? '',
      merchantId: record.merchantId ? this.encryption.decrypt(record.merchantId) : '',
      secret: record.secret ? this.encryption.decrypt(record.secret) : '',
      extra,
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

  private toApi(record: PaymentSettingsRecord): PaymentSettingsApi {
    return {
      provider: record.provider,
      enabled: record.enabled,
      testMode: record.testMode,
      merchantId: record.merchantId ? EncryptionService.MASKED_VALUE : '',
      secret: record.secret ? EncryptionService.MASKED_VALUE : '',
      apiUrl: record.apiUrl ?? '',
      hasMerchantId: Boolean(record.merchantId),
      hasSecret: Boolean(record.secret),
      hasExtra: Boolean(record.extra),
      updatedBy: record.updatedBy,
      createdAt: record.createdAt,
      updatedAt: record.updatedAt,
    };
  }

  private emptyApi(provider: PaymentMethod): PaymentSettingsApi {
    const now = new Date();
    return {
      provider,
      enabled: false,
      testMode: true,
      merchantId: '',
      secret: '',
      apiUrl: '',
      hasMerchantId: false,
      hasSecret: false,
      hasExtra: false,
      createdAt: now,
      updatedAt: now,
    };
  }

  private assertSupported(provider: PaymentMethod): void {
    if (!SUPPORTED_PROVIDERS.includes(provider)) {
      throw new NotFoundException('Этот провайдер не поддерживается');
    }
  }
}
