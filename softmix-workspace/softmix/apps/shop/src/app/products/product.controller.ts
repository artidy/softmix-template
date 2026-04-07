import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Query, Param, Patch, Post, Logger } from '@nestjs/common';
import { UrlPaths, UserRole } from '@project-lib/shared-types';
import { Auth, fillObject } from '@project-lib/core';

import { ProductService } from './product.service';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';
import { ProductRdo } from './rdo/product.rdo';
import ProductQuery from './queries/product.query';

@ApiTags(UrlPaths.Products)
@Controller(UrlPaths.Products)
export class ProductController {
  constructor(private readonly service: ProductService) {}

  @ApiResponse({
    status: HttpStatus.OK, description: 'Данные успешно получены'
  })
  @Get()
  public async index(@Query() query: ProductQuery) {
    const elements = await this.service.findAll(query);

    return {
      products: fillObject(ProductRdo, elements.products),
      total: elements.total,
    };
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Данные успешно получены'
  })
  @Get('/:id')
  public async findById(@Param('id') id: string) {
    const element = await this.service.findById(id);

    return fillObject(ProductRdo, element);
  }

  @ApiResponse({
    status: HttpStatus.CREATED, description: 'Данные успешно добавлены'
  })
  @Auth(UserRole.Admin)
  @Post('/')
  public async create(@Body() dto: CreateProductDto) {
    const element = await this.service.create(dto);

    return fillObject(ProductRdo, element);
  }

  @ApiResponse({
    status: HttpStatus.CREATED, description: 'Данные успешно добавлены'
  })
  @Auth(UserRole.Admin)
  @Post('/many')
  public async createMany(@Body() dto: CreateProductDto[]) {
    const elements = await this.service.createMany(dto);

    return fillObject(ProductRdo, elements);
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Данные успешно обновлены'
  })
  @Auth(UserRole.Admin)
  @Patch('/:id')
  public async update(@Param('id') id: string, @Body() dto: UpdateProductDto) {
    const element = await this.service.update(id, dto);

    return fillObject(ProductRdo, element);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT, description: 'Данные успешно удалены'
  })
  @Auth(UserRole.Admin)
  @Delete('/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string) {
    await this.service.delete(id);
  }
}
