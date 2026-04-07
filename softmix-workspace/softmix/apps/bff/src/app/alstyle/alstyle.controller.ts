import { Controller, Get, HttpCode, HttpStatus, Param, Query } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { ProductsParamsQuery } from '@project-lib/core';
import { AlStyleRoutes } from '@project-lib/shared-types';

import { AlstyleService } from './alstyle.service';

@ApiTags(AlStyleRoutes.AlStyle)
@Controller(AlStyleRoutes.AlStyle)
export class AlstyleController {
  constructor(private readonly service: AlstyleService) {}

  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно получили данные'
  })
  @Get(AlStyleRoutes.Categories)
  @HttpCode(HttpStatus.OK)
  public async getCategories() {
    return this.service.getCategories();
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно получили данные'
  })
  @Get(`${AlStyleRoutes.Products}/:categoryId`)
  @HttpCode(HttpStatus.OK)
  public async getProducts(@Param('categoryId') categoryId: number, @Query() query: ProductsParamsQuery) {
    return this.service.getProducts(categoryId, query);
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно получили данные'
  })
  @Get(AlStyleRoutes.Images)
  @HttpCode(HttpStatus.OK)
  public async getImages(@Param('id') id: number) {
    return this.service.getImages(id);
  }
}
