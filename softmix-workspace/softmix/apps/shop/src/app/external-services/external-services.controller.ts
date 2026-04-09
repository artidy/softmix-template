import { Body, Controller, Delete, Get, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UrlPaths } from '@project-lib/shared-types';

import { ExternalServicesService } from './external-services.service';

@ApiTags(UrlPaths.ExternalServices)
@Controller(UrlPaths.ExternalServices)
export class ExternalServicesController {
  constructor(private readonly service: ExternalServicesService) {}

  @ApiResponse({ status: HttpStatus.OK, description: 'Список внешних сервисов' })
  @Get('')
  @HttpCode(HttpStatus.OK)
  public async findAll() {
    return this.service.findAll();
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Список активных сервисов' })
  @Get('active')
  @HttpCode(HttpStatus.OK)
  public async findActive() {
    return this.service.findActive();
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Сервис по имени' })
  @Get('by-name/:name')
  @HttpCode(HttpStatus.OK)
  public async findByName(@Param('name') name: string) {
    return this.service.findByName(name);
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Сервис по id' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async findById(@Param('id') id: string) {
    return this.service.findById(id);
  }

  @ApiResponse({ status: HttpStatus.CREATED, description: 'Сервис создан' })
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() createData) {
    return this.service.create(createData);
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Сервис обновлён' })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(@Param('id') id: string, @Body() updateData) {
    return this.service.update(id, updateData);
  }

  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Сервис удалён' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string) {
    return this.service.delete(id);
  }
}
