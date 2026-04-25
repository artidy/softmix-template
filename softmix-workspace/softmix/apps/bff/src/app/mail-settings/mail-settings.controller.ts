import { Body, Controller, Get, Headers, HttpCode, HttpStatus, Post, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { MailSettingsApi, UpdateMailSettingsDto } from '@project-lib/shared-types';

import { MailSettingsBffService } from './mail-settings.service';

@ApiTags('mail-settings')
@ApiBearerAuth()
@Controller('mail-settings')
export class MailSettingsBffController {
  constructor(private readonly mailSettingsService: MailSettingsBffService) {}

  @Get()
  @ApiOperation({ summary: 'Получить настройки SMTP (admin)' })
  public async get(@Headers() headers: Record<string, string>): Promise<MailSettingsApi> {
    return this.mailSettingsService.get(headers);
  }

  @Put()
  @ApiOperation({ summary: 'Сохранить настройки SMTP (admin)' })
  public async update(
    @Body() dto: UpdateMailSettingsDto,
    @Headers() headers: Record<string, string>,
  ): Promise<MailSettingsApi> {
    return this.mailSettingsService.update(dto, headers);
  }

  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отправить тестовое письмо (admin)' })
  public async test(
    @Body() body: { to?: string },
    @Headers() headers: Record<string, string>,
  ) {
    return this.mailSettingsService.test(body, headers);
  }
}
