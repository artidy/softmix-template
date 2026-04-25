import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'email_verifications',
  timestamps: true,
})
class EmailVerificationModel extends Document<string> {
  @Prop({ required: true, index: true })
  public userId: string;

  @Prop({ required: true, unique: true, index: true })
  public token: string;

  @Prop({ required: true })
  public expiresAt: Date;

  @Prop({ required: false })
  public usedAt?: Date;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

const EmailVerificationSchema = SchemaFactory.createForClass(EmailVerificationModel);

EmailVerificationSchema.index({ userId: 1, createdAt: -1 });

export { EmailVerificationModel, EmailVerificationSchema };
