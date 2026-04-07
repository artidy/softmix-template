import {
  Controller,
  HttpCode,
  HttpStatus,
  Post,
  Headers,
  Param, UseInterceptors, UploadedFile, Get, Query,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductImageSettings, UrlPaths, UserRole } from '@project-lib/shared-types';
import { Auth } from '@project-lib/core';
import FormData from 'form-data';

import { UploaderService } from './uploader.service';

@ApiTags(`${UrlPaths.Uploader}/${UrlPaths.Products}`)
@Controller(`${UrlPaths.Uploader}/${UrlPaths.Products}`)
export class UploaderController {
  constructor(private readonly service: UploaderService) {}

  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно получили данные'
  })
  @Get('')
  @HttpCode(HttpStatus.OK)
  public async index(@Headers() headers) {
    return this.service.findAll(headers);
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно получили данные'
  })
  @Get(':ownerId')
  @HttpCode(HttpStatus.OK)
  public async findByOwnerId(@Param('ownerId') ownerId: string, @Headers() headers) {
    return this.service.findByOwnerId(ownerId, headers);
  }

  @Auth(UserRole.Admin, UserRole.Manager)
  @ApiResponse({
    status: HttpStatus.CREATED, description: 'Вы успешно создали'
  })
  @Post(':ownerId')
  @UseInterceptors(FileInterceptor(ProductImageSettings.FieldName))
  @HttpCode(HttpStatus.CREATED)
  public async create(@UploadedFile() uploadData, @Param('ownerId') ownerId: string, @Headers() headers) {
    const formData = new FormData();
    formData.append('file', uploadData.buffer, {
      filename: uploadData.originalname,
      contentType: uploadData.mimeType,
    });

    headers = {
      'Authorization': headers.Authorization,
      'Content-Type': `multipart/form-data; boundary=${formData.getBoundary()}`,
    }

    return this.service.create(ownerId, formData, headers);
  }
}
