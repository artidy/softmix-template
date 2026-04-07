import { Module } from "@nestjs/common";
import { MongooseModule } from '@nestjs/mongoose';

import { ProductImageModel, ProductImageSchema } from './product-image.model';
import { ProductImageController } from './product-image.controller';
import { ProductImageService } from './product-image.service';
import { ProductImageRepository } from './product-image.repository';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: ProductImageModel.name, schema: ProductImageSchema }
    ]),
  ],
  controllers: [ProductImageController],
  providers: [ProductImageService, ProductImageRepository]
})
export class ProductImageModule {}
