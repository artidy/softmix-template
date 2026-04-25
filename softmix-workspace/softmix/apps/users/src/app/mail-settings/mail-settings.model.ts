import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

@Schema({
  collection: 'mail_settings',
  timestamps: true,
})
class MailSettingsModel extends Document<string> {
  @Prop({ required: true, default: false })
  public enabled: boolean;

  @Prop({ default: '' })
  public host: string;

  @Prop({ default: 587 })
  public port: number;

  @Prop({ default: false })
  public secure: boolean;

  @Prop({ default: '' })
  public user: string;

  @Prop({ default: '' })
  public password: string;

  @Prop({ default: '' })
  public fromAddress: string;

  @Prop({ default: '' })
  public adminEmail: string;

  @Prop({ default: 'Softmix' })
  public shopName: string;

  @Prop({ default: '' })
  public shopUrl: string;

  @Prop()
  public updatedBy?: string;

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

const MailSettingsSchema = SchemaFactory.createForClass(MailSettingsModel);

export { MailSettingsModel, MailSettingsSchema };
