import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { MailSettingsModel } from './mail-settings.model';

export interface MailSettingsRecord {
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
  updatedBy?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UpsertMailSettingsInput {
  enabled?: boolean;
  host?: string;
  port?: number;
  secure?: boolean;
  user?: string;
  password?: string;
  fromAddress?: string;
  adminEmail?: string;
  shopName?: string;
  shopUrl?: string;
  updatedBy?: string;
}

@Injectable()
export class MailSettingsRepository {
  constructor(
    @InjectModel(MailSettingsModel.name) private readonly model: Model<MailSettingsModel>,
  ) {}

  public async findCurrent(): Promise<MailSettingsRecord | null> {
    const doc = await this.model.findOne().sort({ updatedAt: -1 }).exec();
    return doc ? this.toRecord(doc) : null;
  }

  public async upsert(input: UpsertMailSettingsInput): Promise<MailSettingsRecord> {
    const update: Record<string, unknown> = {};
    if (input.enabled !== undefined) update.enabled = input.enabled;
    if (input.host !== undefined) update.host = input.host;
    if (input.port !== undefined) update.port = input.port;
    if (input.secure !== undefined) update.secure = input.secure;
    if (input.user !== undefined) update.user = input.user;
    if (input.password !== undefined) update.password = input.password;
    if (input.fromAddress !== undefined) update.fromAddress = input.fromAddress;
    if (input.adminEmail !== undefined) update.adminEmail = input.adminEmail;
    if (input.shopName !== undefined) update.shopName = input.shopName;
    if (input.shopUrl !== undefined) update.shopUrl = input.shopUrl;
    if (input.updatedBy !== undefined) update.updatedBy = input.updatedBy;

    const doc = await this.model
      .findOneAndUpdate({}, { $set: update }, { new: true, upsert: true })
      .exec();
    return this.toRecord(doc);
  }

  private toRecord(doc: MailSettingsModel): MailSettingsRecord {
    return {
      enabled: doc.enabled,
      host: doc.host ?? '',
      port: doc.port ?? 587,
      secure: doc.secure ?? false,
      user: doc.user ?? '',
      password: doc.password ?? '',
      fromAddress: doc.fromAddress ?? '',
      adminEmail: doc.adminEmail ?? '',
      shopName: doc.shopName ?? 'Softmix',
      shopUrl: doc.shopUrl ?? '',
      updatedBy: doc.updatedBy,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
