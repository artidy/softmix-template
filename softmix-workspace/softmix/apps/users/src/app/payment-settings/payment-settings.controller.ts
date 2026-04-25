import { Body, Controller, Get, Param, Put, UseFilters, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  EditDataForbiddenException,
  HttpExceptionFilter,
  UserDecorator,
} from '@project-lib/core';
import {
  PaymentMethod,
  PaymentSettingsApi,
  UserRequest,
  UserRole,
} from '@project-lib/shared-types';

import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { UpdatePaymentSettingsDto } from './dto/update-payment-settings.dto';
import { PaymentSettingsService } from './payment-settings.service';

@UseFilters(HttpExceptionFilter)
@ApiTags('payment-settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('payment-settings')
export class PaymentSettingsController {
  constructor(private readonly settingsService: PaymentSettingsService) {}

  @Get()
  @ApiOperation({ summary: 'Список настроек всех платёжных провайдеров (admin only)' })
  public async list(@UserDecorator() user: UserRequest): Promise<PaymentSettingsApi[]> {
    this.assertAdmin(user);
    return this.settingsService.listAll();
  }

  @Get(':provider')
  @ApiOperation({ summary: 'Настройки одного провайдера (admin only)' })
  public async get(
    @UserDecorator() user: UserRequest,
    @Param('provider') provider: PaymentMethod,
  ): Promise<PaymentSettingsApi> {
    this.assertAdmin(user);
    return this.settingsService.getOne(provider);
  }

  @Put(':provider')
  @ApiOperation({ summary: 'Обновить настройки провайдера (admin only)' })
  public async update(
    @UserDecorator() user: UserRequest,
    @Param('provider') provider: PaymentMethod,
    @Body() dto: UpdatePaymentSettingsDto,
  ): Promise<PaymentSettingsApi> {
    this.assertAdmin(user);
    return this.settingsService.update(provider, dto, user.id);
  }

  private assertAdmin(user: UserRequest): void {
    if (user.role !== UserRole.Admin) {
      throw new EditDataForbiddenException();
    }
  }
}
