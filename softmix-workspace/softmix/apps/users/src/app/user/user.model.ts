import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { User, UserRole } from '@project-lib/shared-types';

@Schema({
  collection: 'users',
  timestamps: true
})
class UserModel extends Document<string> implements User {
  @Prop({
    required: true
  })
  public name: string;

  @Prop({
    unique: true,
    required: true,
  })
  public login: string;

  @Prop({
    required: true
  })
  public passwordHash: string;

  @Prop({
    required: true,
    type: String,
    enum: UserRole
  })
  public role: UserRole;

  @Prop({
    required: false,
    unique: true,
    sparse: true
  })
  public email?: string;

  @Prop({
    required: false
  })
  public phone?: string;

  @Prop({
    required: false
  })
  public address?: string;

  @Prop()
  public createdAt: Date;
}

const UserSchema = SchemaFactory.createForClass(UserModel);

export {
  UserModel,
  UserSchema
}
