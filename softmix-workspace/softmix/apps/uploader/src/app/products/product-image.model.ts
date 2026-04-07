import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';
import { File } from '@project-lib/shared-types';

@Schema({
  collection: 'products_images',
  timestamps: true
})
class ProductImageModel extends Document<string> implements File {
  @Prop()
  public ownerId: string;

  @Prop()
  public name: string;
}

const ProductImageSchema = SchemaFactory.createForClass(ProductImageModel);

export {
  ProductImageModel,
  ProductImageSchema
}
