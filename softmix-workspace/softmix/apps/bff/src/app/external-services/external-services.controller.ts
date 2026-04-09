import { Body, Controller, Delete, Get, Headers, HttpCode, HttpStatus, Param, Post, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UrlPaths, UserRole } from '@project-lib/shared-types';
import { Auth } from '@project-lib/core';

import { ExternalServicesService } from './external-services.service';

@ApiTags(UrlPaths.ExternalServices)
@Controller(UrlPaths.ExternalServices)
export class ExternalServicesController {
  constructor(private readonly service: ExternalServicesService) {}

  @Auth(UserRole.Admin)
  @ApiResponse({ status: HttpStatus.OK, description: 'Список внешних сервисов' })
  @Get('')
  @HttpCode(HttpStatus.OK)
  public async findAll(@Headers() headers) {
    return this.service.findAll(headers);
  }

  @Auth(UserRole.Admin)
  @ApiResponse({ status: HttpStatus.OK, description: 'Сервис по id' })
  @Get(':id')
  @HttpCode(HttpStatus.OK)
  public async findById(@Param('id') id: string, @Headers() headers) {
    return this.service.findById(id, headers);
  }

  @Auth(UserRole.Admin)
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Сервис создан' })
  @Post('')
  @HttpCode(HttpStatus.CREATED)
  public async create(@Body() createData, @Headers() headers) {
    return this.service.create(createData, headers);
  }

  @Auth(UserRole.Admin)
  @ApiResponse({ status: HttpStatus.OK, description: 'Сервис обновлён' })
  @Put(':id')
  @HttpCode(HttpStatus.OK)
  public async update(@Param('id') id: string, @Body() updateData, @Headers() headers) {
    return this.service.update(id, updateData, headers);
  }

  @Auth(UserRole.Admin)
  @ApiResponse({ status: HttpStatus.NO_CONTENT, description: 'Сервис удалён' })
  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  public async delete(@Param('id') id: string, @Headers() headers) {
    return this.service.delete(id, headers);
  }
}
