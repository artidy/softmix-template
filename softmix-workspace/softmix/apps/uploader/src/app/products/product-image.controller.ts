import {
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus, Logger,
  Param,
  Patch,
  Post,
  UploadedFile,
  UseInterceptors
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { FileInterceptor } from '@nestjs/platform-express';
import { fillObject } from '@project-lib/core';
import { IMAGE_TYPES, ProductImageSettings, UrlPaths } from '@project-lib/shared-types';

import { getMulterConfig } from '../../config/multer.config';
import { getFilePipe } from '../helpers';
import { ProductImageService } from './product-image.service';
import { ProductImageRdo } from './rdo/product-image.rdo';

@ApiTags(`${UrlPaths.Uploader}/${UrlPaths.Products}`)
@Controller(`${UrlPaths.Uploader}/${UrlPaths.Products}`)
export class ProductImageController {
  constructor(
    private readonly service: ProductImageService
  ) {}

  @ApiResponse({
    status: HttpStatus.OK, description: 'Данные успешно получены'
  })
  @Get()
  public async index() {
    const files = await this.service.findAll();

    return fillObject(ProductImageRdo, files);
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Данные успешно получены'
  })
  @Get('/:id')
  public async getOwnerImage(@Param('id') id: string) {
    const file = await this.service.findByOwnerId(id);

    return fillObject(ProductImageRdo, file);
  }

  @ApiResponse({
    status: HttpStatus.CREATED, description: 'Данные успешно добавлены'
  })
  @Post('/:id')
  @UseInterceptors(FileInterceptor(
    ProductImageSettings.FieldName,
    getMulterConfig(ProductImageSettings.Directory, ProductImageSettings.MaxSize)))
  public async create(
    @Param('id') id: string,
    @UploadedFile(getFilePipe(IMAGE_TYPES)) file: Express.Multer.File
  ) {
    const name = file.filename;
    const newFile = await this.service.updateOrCreate(id, name);
    const url = await this.service.getAvatarUrl(id);

    return fillObject(ProductImageRdo, {
      _id: newFile._id,
      name: newFile.name,
      ownerId: newFile.ownerId,
      url
    });
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT, description: 'Данные успешно удалены'
  })
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
