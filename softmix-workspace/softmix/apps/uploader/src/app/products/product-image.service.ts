import { Injectable } from '@nestjs/common';
import fs from 'fs';
import { EntityNotFoundException, EntityType, FileNotUploadedException } from '@project-lib/core';
import { File, ProductImageSettings } from '@project-lib/shared-types';

import { getFullPathFile, getShortPathFile } from '../helpers';
import { ProductImageRepository } from './product-image.repository';
import { ProductImageEntity } from './product-image.entity';

@Injectable()
export class ProductImageService {
  constructor(
    private readonly repository: ProductImageRepository
  ) {}

  public async findAll() {
    const files = await this.repository.findAll();

    return files.map((file) => {
      return {
        _id: file._id,
        name: file.name,
        ownerId: file.ownerId,
        url: getShortPathFile(ProductImageSettings.Directory, file.name),
      }
    });
  }

  public async findByOwnerId(ownerId: string) {
    const file = await this.repository.findByOwnerId(ownerId);
    
    return {
      _id: file._id,
      name: file.name,
      ownerId: file.ownerId,
      url: getShortPathFile(ProductImageSettings.Directory, file.name),
    };
  }

  public async updateOrCreate(ownerId: string, name: string): Promise<File> {
    const existFile = await this.repository.findByOwnerId(ownerId);

    if (existFile) {
      return this.change(ownerId, name);
    }

    const newFile = new ProductImageEntity({ ownerId, name });

    return this.repository.create(newFile);
  }

  public async delete(ownerId: string): Promise<void> {
    const existFile = await this.repository.findByOwnerId(ownerId);

    if (!existFile) {
      throw new EntityNotFoundException(EntityType.File, ownerId);
    }

    await this.repository.destroy(ownerId);

    fs.unlinkSync(getFullPathFile(ProductImageSettings.Directory, existFile.name));
  }

  public async change(ownerId: string, name: string) {
    const existFile = await this.repository.findByOwnerId(ownerId);

    if (!existFile) {
      throw new EntityNotFoundException(EntityType.File, ownerId);
    }

    if (!name) {
      throw new FileNotUploadedException(EntityType.File, ownerId);
    }

    const file = new ProductImageEntity({ ownerId, name });

    return this.repository.update(ownerId, file);
  }

  public async getAvatarUrl(ownerId: string) {
    const file = await this.repository.findByOwnerId(ownerId);

    return file ? getShortPathFile(ProductImageSettings.Directory, file.name) : '';
  }
}
