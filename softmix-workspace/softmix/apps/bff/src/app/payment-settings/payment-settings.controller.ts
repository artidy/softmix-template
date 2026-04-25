import { Body, Controller, Get, Headers, Param, Put } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { PaymentSettingsApi, UpdatePaymentSettingsDto } from '@project-lib/shared-types';

import { PaymentSettingsBffService } from './payment-settings.service';

@ApiTags('payment-settings')
@ApiBearerAuth()
@Controller('payment-settings')
export class PaymentSettingsBffController {
  constructor(private readonly settingsService: PaymentSettingsBffService) {}

  @Get()
  @ApiOperation({ summary: 'Список настроек всех платёжных провайдеров (admin)' })
  public async list(@Headers() headers: Record<string, string>): Promise<PaymentSettingsApi[]> {
    return this.settingsService.list(headers);
  }

  @Get(':provider')
  @ApiOperation({ summary: 'Настройки провайдера (admin)' })
  public async get(
    @Param('provider') provider: string,
    @Headers() headers: Record<string, string>,
  ): Promise<PaymentSettingsApi> {
    return this.settingsService.get(provider, headers);
  }

  @Put(':provider')
  @ApiOperation({ summary: 'Обновить настройки провайдера (admin)' })
  public async update(
    @Param('provider') provider: string,
    @Body() dto: UpdatePaymentSettingsDto,
    @Headers() headers: Record<string, string>,
  ): Promise<PaymentSettingsApi> {
    return this.settingsService.update(provider, dto, headers);
  }
}
