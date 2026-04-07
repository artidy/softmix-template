import { Body, Controller, Get, HttpCode, HttpStatus, Post, Headers, Param, Patch, Delete } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UrlPaths } from '@project-lib/shared-types';

import { CategoryService } from './category.service';

@ApiTags(UrlPaths.Categories)
@Controller(UrlPaths.Categories)
export class CategoryController {
  constructor(private readonly service: CategoryService) {}

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
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async getById(@Param('id') id: string, @Headers() headers) {
    return this.service.findById(id, headers);
  }

  @ApiResponse({
    status: HttpStatus.CREATED, description: 'Вы успешно создали'
  })
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() createData, @Headers() headers) {
    return this.service.create(createData, headers);
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Вы успешно обновили данные'
  })
  @Patch(':id')
  @HttpCode(HttpStatus.OK)
  public async update(@Param('id') id: string, @Body() updateData, @Headers() headers) {
    return this.service.update(id, updateData, headers);
  }

  @ApiResponse({
    status: HttpStatus.NO_CONTENT, description: 'Вы успешно удалили данные'
  })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Headers() headers, @Param('id') id: string) {
    await this.service.delete(headers, id);
  }
}
