import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { PaymentMethod, PaymentStatus } from '@project-lib/shared-types';

import { PaymentTransactionModel } from './payment-transaction.model';

export interface PaymentTransactionRecord {
  id: string;
  orderId: string;
  orderNumber: string;
  provider: PaymentMethod;
  providerTxId: string;
  amount: number;
  status: PaymentStatus;
  initPayload?: Record<string, unknown>;
  webhookPayload?: Record<string, unknown>;
  createdAt: Date;
  updatedAt: Date;
}

export interface CreateTransactionInput {
  orderId: string;
  orderNumber: string;
  provider: PaymentMethod;
  providerTxId: string;
  amount: number;
  initPayload?: Record<string, unknown>;
}

@Injectable()
export class PaymentTransactionRepository {
  constructor(
    @InjectModel(PaymentTransactionModel.name)
    private readonly model: Model<PaymentTransactionModel>,
  ) {}

  public async create(input: CreateTransactionInput): Promise<PaymentTransactionRecord> {
    const document = new this.model({
      ...input,
      status: PaymentStatus.Pending,
    });
    const saved = await document.save();
    return this.toRecord(saved);
  }

  public async findById(id: string): Promise<PaymentTransactionRecord | null> {
    const doc = await this.model.findById(id).exec();
    return doc ? this.toRecord(doc) : null;
  }

  public async findLatestByOrderId(orderId: string): Promise<PaymentTransactionRecord | null> {
    const doc = await this.model.findOne({ orderId }).sort({ createdAt: -1 }).exec();
    return doc ? this.toRecord(doc) : null;
  }

  public async findByProviderTxId(
    providerTxId: string,
  ): Promise<PaymentTransactionRecord | null> {
    const doc = await this.model.findOne({ providerTxId }).exec();
    return doc ? this.toRecord(doc) : null;
  }

  public async updateStatus(
    id: string,
    status: PaymentStatus,
    webhookPayload?: Record<string, unknown>,
  ): Promise<PaymentTransactionRecord | null> {
    const doc = await this.model
      .findByIdAndUpdate(
        id,
        { status, ...(webhookPayload ? { webhookPayload } : {}) },
        { new: true },
      )
      .exec();
    return doc ? this.toRecord(doc) : null;
  }

  private toRecord(doc: PaymentTransactionModel): PaymentTransactionRecord {
    return {
      id: doc._id.toString(),
      orderId: doc.orderId,
      orderNumber: doc.orderNumber,
      provider: doc.provider,
      providerTxId: doc.providerTxId,
      amount: doc.amount,
      status: doc.status,
      initPayload: doc.initPayload,
      webhookPayload: doc.webhookPayload,
      createdAt: doc.createdAt,
      updatedAt: doc.updatedAt,
    };
  }
}
