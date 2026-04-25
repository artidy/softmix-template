import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { PaymentMethod } from '@project-lib/shared-types';

@Schema({
  collection: 'payment_provider_settings',
  timestamps: true,
})
class PaymentSettingsModel extends Document<string> {
  @Prop({ required: true, unique: true, index: true, type: String, enum: PaymentMethod })
  public provider: PaymentMethod;

  @Prop({ required: true, default: false })
  public enabled: boolean;

  @Prop({ required: true, default: true })
  public testMode: boolean;

  @Prop({ default: '' })
  public merchantId: string;

  @Prop({ default: '' })
  public secret: string;

  @Prop({ default: '' })
  public apiUrl: string;

  @Prop({ default: '' })
  public extra: string;

  @Prop()
  public updatedBy?: string;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

const PaymentSettingsSchema = SchemaFactory.createForClass(PaymentSettingsModel);

export { PaymentSettingsModel, PaymentSettingsSchema };
