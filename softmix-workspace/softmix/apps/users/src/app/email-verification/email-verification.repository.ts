import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { EmailVerificationModel } from './email-verification.model';

export interface EmailVerificationRecord {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  usedAt?: Date;
  createdAt: Date;
}

@Injectable()
export class EmailVerificationRepository {
  constructor(
    @InjectModel(EmailVerificationModel.name)
    private readonly model: Model<EmailVerificationModel>,
  ) {}

  public async create(input: { userId: string; token: string; expiresAt: Date }): Promise<EmailVerificationRecord> {
    const doc = await new this.model(input).save();
    return this.toRecord(doc);
  }

  public async findByToken(token: string): Promise<EmailVerificationRecord | null> {
    const doc = await this.model.findOne({ token }).exec();
    return doc ? this.toRecord(doc) : null;
  }

  public async markUsed(id: string): Promise<void> {
    await this.model.findByIdAndUpdate(id, { usedAt: new Date() }).exec();
  }

  public async invalidateActiveForUser(userId: string): Promise<void> {
    await this.model.updateMany(
      { userId, usedAt: { $exists: false } },
      { $set: { usedAt: new Date() } },
    ).exec();
  }

  private toRecord(doc: EmailVerificationModel): EmailVerificationRecord {
    return {
      id: doc._id.toString(),
      userId: doc.userId,
      token: doc.token,
      expiresAt: doc.expiresAt,
      usedAt: doc.usedAt,
      createdAt: doc.createdAt,
    };
  }
}
