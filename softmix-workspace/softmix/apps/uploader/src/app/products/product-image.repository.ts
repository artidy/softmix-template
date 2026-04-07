import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CRUDRepository } from '@project-lib/core';
import { File } from '@project-lib/shared-types';

import { ProductImageEntity } from './product-image.entity';
import { ProductImageModel } from './product-image.model';

@Injectable()
export class ProductImageRepository implements CRUDRepository<ProductImageEntity, string, File> {
  constructor(
    @InjectModel(ProductImageModel.name) private readonly productImageModel: Model<ProductImageModel>
  ) {}

  public async findAll(): Promise<File[]> {
    return this.productImageModel.find();
  }

  public async create(productImage: ProductImageEntity): Promise<File> {
    return (new this.productImageModel(productImage)).save();
  }

  public async destroy(ownerId: string): Promise<void> {
    await this.productImageModel.deleteOne({ ownerId });
  }

  public async findById(id: string): Promise<File | null> {
    return this.productImageModel.findOne({ id });
  }

  public async findByOwnerId(ownerId: string): Promise<File | null> {
    return this.productImageModel.findOne({ ownerId });
  }

  public async update(ownerId: string, productImage: ProductImageEntity): Promise<File> {
    return this.productImageModel.findOneAndUpdate(
      { ownerId },
      { fileName: productImage.name }, { new: true }
    ).exec();
  }
}
