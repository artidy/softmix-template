import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, SchemaTypes } from 'mongoose';
import { PaymentMethod, PaymentStatus } from '@project-lib/shared-types';

@Schema({
  collection: 'payment_transactions',
  timestamps: true,
})
class PaymentTransactionModel extends Document<string> {
  @Prop({ required: true, index: true })
  public orderId: string;

  @Prop({ required: true, index: true })
  public orderNumber: string;

  @Prop({ required: true, type: String, enum: PaymentMethod })
  public provider: PaymentMethod;

  @Prop({ required: true, index: true })
  public providerTxId: string;

  @Prop({ required: true })
  public amount: number;

  @Prop({ required: true, type: String, enum: PaymentStatus, default: PaymentStatus.Pending })
  public status: PaymentStatus;

  @Prop({ type: SchemaTypes.Mixed, required: false })
  public initPayload?: Record<string, unknown>;

  @Prop({ type: SchemaTypes.Mixed, required: false })
  public webhookPayload?: Record<string, unknown>;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

const PaymentTransactionSchema = SchemaFactory.createForClass(PaymentTransactionModel);

PaymentTransactionSchema.index({ orderId: 1, createdAt: -1 });

export { PaymentTransactionModel, PaymentTransactionSchema };
