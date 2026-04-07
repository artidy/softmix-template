import { Body, Controller, Get, HttpCode, HttpStatus, Put } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UrlPaths } from '@project-lib/shared-types';

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
  public async get() {
    return this.service.get();
  }

  @ApiResponse({
    status: HttpStatus.OK, description: 'Настройки сайта обновлены'
  })
  @Put('')
  @HttpCode(HttpStatus.OK)
  public async update(@Body() updateData) {
    return this.service.update(updateData);
  }
}
