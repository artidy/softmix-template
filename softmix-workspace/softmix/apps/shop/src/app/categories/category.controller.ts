import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Logger, Param, Patch, Post } from '@nestjs/common';
import { UrlPaths, UserRole } from '@project-lib/shared-types';
import { Auth, fillObject } from '@project-lib/core';

import { CategoryService } from './category.service';
import { CategoryRdo } from './rdo/category.rdo';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';

@ApiTags(UrlPaths.Categories)
@Controller(UrlPaths.Categories)
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

  @ApiResponse({
    status: HttpStatus.OK, description: 'Данные успешно получены'
  })
  @Get()
  public async index() {
    const elements = await this.service.findAll();

    return fillObject(CategoryRdo, elements);
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Данные успешно получены'
  })
  @Get('/:id')
  public async findById(@Param('id') id: string) {
    const element = await this.service.findById(id);

    return fillObject(CategoryRdo, element);
  }

  @ApiResponse({
    status: HttpStatus.CREATED, description: 'Данные успешно добавлены'
  })
  @Auth(UserRole.Admin)
  @Post('/')
  public async create(@Body() dto: CreateCategoryDto) {
    const element = await this.service.create(dto);

    return fillObject(CategoryRdo, element);
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Данные успешно обновлены'
  })
  @Auth(UserRole.Admin)
  @Patch('/:id')
  public async update(@Param('id') id: string, @Body() dto: UpdateCategoryDto) {
    const element = await this.service.update(id, dto);

    return fillObject(CategoryRdo, element);
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
