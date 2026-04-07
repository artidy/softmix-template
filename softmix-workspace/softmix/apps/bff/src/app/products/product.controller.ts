import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Headers,
  Param,
  Patch,
  Delete,
  Query
} from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UrlPaths, UserRole } from '@project-lib/shared-types';
import { Auth } from '@project-lib/core';

import { ProductService } from './product.service';

@ApiTags(UrlPaths.Products)
@Controller(UrlPaths.Products)
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно получили данные'
  })
  @Get('')
  @HttpCode(HttpStatus.OK)
  public async index(@Headers() headers, @Query() query) {
    return this.service.findAll(headers, query);
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно получили данные'
  })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getById(@Param('id') id: string, @Headers() headers) {
    return this.service.findById(id, headers);
  }

  @Auth(UserRole.Admin, UserRole.Manager)
  @ApiResponse({
    status: HttpStatus.CREATED, description: 'Вы успешно создали'
  })
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() createData, @Headers() headers) {
    return this.service.create(createData, headers);
  }

  @Auth(UserRole.Admin, UserRole.Manager)
  @ApiResponse({
    status: HttpStatus.CREATED, description: 'Вы успешно создали'
  })
  @Post('/many')
  @HttpCode(HttpStatus.CREATED)
  public async createMany(@Body() createData, @Headers() headers) {
    return this.service.createMany(createData, headers);
  }

  @Auth(UserRole.Admin, UserRole.Manager)
  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно обновили данные'
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  public async update(@Param('id') id: string, @Body() updateData, @Headers() headers) {
    return this.service.update(id, updateData, headers);
  }

  @Auth(UserRole.Admin, UserRole.Manager)
  @ApiResponse({
    status: HttpStatus.NO_CONTENT, description: 'Вы успешно удалили данные'
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Headers() headers, @Param('id') id: string) {
    await this.service.delete(headers, id);
  }
}
