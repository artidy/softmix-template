import { Body, Controller, Get, HttpCode, HttpStatus, Put, Headers } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UrlPaths, UserRole } from '@project-lib/shared-types';
import { Auth } from '@project-lib/core';

import { SettingsService } from './settings.service';

@ApiTags(UrlPaths.Settings)
@Controller(UrlPaths.Settings)
export class SettingsController {
  constructor(private readonly service: SettingsService) {}

  @ApiResponse({
    status: HttpStatus.OK, description: 'Настройки сайта получены'
  })
  @Get('')
  @HttpCode(HttpStatus.OK)
  public async get(@Headers() headers) {
    return this.service.get(headers);
  }

  @Auth(UserRole.Admin)
  @ApiResponse({
    status: HttpStatus.OK, description: 'Настройки сайта обновлены'
  })
  @Put('')
  @HttpCode(HttpStatus.OK)
  public async update(@Body() updateData, @Headers() headers) {
    return this.service.update(updateData, headers);
  }
}
