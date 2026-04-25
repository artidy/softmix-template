import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentMethod } from '@project-lib/shared-types';

import { PaymentSettingsModel } from './payment-settings.model';

export interface PaymentSettingsRecord {
  id: string;
  provider: PaymentMethod;
  enabled: boolean;
  testMode: boolean;
  merchantId: string;
  secret: string;
  apiUrl: string;
  extra: string;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpsertPaymentSettingsInput {
  provider: PaymentMethod;
  enabled?: boolean;
  testMode?: boolean;
  merchantId?: string;
  secret?: string;
  apiUrl?: string;
  extra?: string;
  updatedBy?: string;
}

@Injectable()
export class PaymentSettingsRepository {
  constructor(
    @InjectModel(PaymentSettingsModel.name)
    private readonly model: Model<PaymentSettingsModel>,
  ) {}

  public async findAll(): Promise<PaymentSettingsRecord[]> {
    const docs = await this.model.find().sort({ provider: 1 }).exec();
    return docs.map((d) => this.toRecord(d));
  }

  public async findByProvider(provider: PaymentMethod): Promise<PaymentSettingsRecord | null> {
    const doc = await this.model.findOne({ provider }).exec();
    return doc ? this.toRecord(doc) : null;
  }

  public async upsert(input: UpsertPaymentSettingsInput): Promise<PaymentSettingsRecord> {
    const update: Record<string, unknown> = {};
    if (input.enabled !== undefined) update.enabled = input.enabled;
    if (input.testMode !== undefined) update.testMode = input.testMode;
    if (input.merchantId !== undefined) update.merchantId = input.merchantId;
    if (input.secret !== undefined) update.secret = input.secret;
    if (input.apiUrl !== undefined) update.apiUrl = input.apiUrl;
    if (input.extra !== undefined) update.extra = input.extra;
    if (input.updatedBy !== undefined) update.updatedBy = input.updatedBy;

    const doc = await this.model
      .findOneAndUpdate(
        { provider: input.provider },
        { $set: update, $setOnInsert: { provider: input.provider } },
        { new: true, upsert: true },
      )
      .exec();
    return this.toRecord(doc);
  }

  private toRecord(doc: PaymentSettingsModel): PaymentSettingsRecord {
    return {
      id: doc._id.toString(),
      provider: doc.provider,
      enabled: doc.enabled,
      testMode: doc.testMode,
      merchantId: doc.merchantId ?? '',
      secret: doc.secret ?? '',
      apiUrl: doc.apiUrl ?? '',
      extra: doc.extra ?? '',
      updatedBy: doc.updatedBy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
