import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { Cart, CartItem } from '@project-lib/shared-types';

@Schema({
  collection: 'carts',
  timestamps: true
})
class CartModel extends Document<string> implements Cart {
  @Prop({ required: true, unique: true, index: true })
  public userId: string;

  @Prop({
    type: [{
      productId: { type: String, required: true },
      title: { type: String, required: true },
      price: { type: Number, required: true },
      quantity: { type: Number, required: true, min: 1 },
      imageUrl: { type: String, required: false }
    }],
    default: []
  })
  public items: CartItem[];

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

const CartSchema = SchemaFactory.createForClass(CartModel);

// Index for fast cart lookup by userId
CartSchema.index({ userId: 1 });

export {
  CartModel,
  CartSchema
}
