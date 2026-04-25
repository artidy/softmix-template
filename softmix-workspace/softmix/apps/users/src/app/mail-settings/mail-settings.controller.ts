import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Post,
  Put,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  EditDataForbiddenException,
  HttpExceptionFilter,
  UserDecorator,
} from '@project-lib/core';
import { MailSettingsApi, UserRequest, UserRole } from '@project-lib/shared-types';

import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { MailService } from '../mail/mail.service';
import { UpdateMailSettingsDto } from './dto/update-mail-settings.dto';
import { MailSettingsService } from './mail-settings.service';

@UseFilters(HttpExceptionFilter)
@ApiTags('mail-settings')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('mail-settings')
export class MailSettingsController {
  constructor(
    private readonly mailSettingsService: MailSettingsService,
    private readonly mailService: MailService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'Получить текущие настройки SMTP (admin only)' })
  public async getCurrent(@UserDecorator() user: UserRequest): Promise<MailSettingsApi> {
    this.assertAdmin(user);
    return this.mailSettingsService.getCurrent();
  }

  @Put()
  @ApiOperation({ summary: 'Обновить настройки SMTP (admin only)' })
  public async update(
    @UserDecorator() user: UserRequest,
    @Body() dto: UpdateMailSettingsDto,
  ): Promise<MailSettingsApi> {
    this.assertAdmin(user);
    const result = await this.mailSettingsService.update(dto, user.id);
    this.mailService.invalidateCache();
    return result;
  }

  @Post('test')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Отправить тестовое письмо (admin only)' })
  public async test(
    @UserDecorator() user: UserRequest,
    @Body() body: { to?: string },
  ): Promise<{ ok: true; sentTo: string }> {
    this.assertAdmin(user);

    const settings = await this.mailSettingsService.getCurrent();
    const to = body.to?.trim() || settings.adminEmail;

    if (!to) {
      throw new BadRequestException('Укажите адрес получателя или сохраните email админа в настройках');
    }

    this.mailService.invalidateCache();
    await this.mailService.sendTestMessage(to);
    return { ok: true, sentTo: to };
  }

  private assertAdmin(user: UserRequest): void {
    if (user.role !== UserRole.Admin) {
      throw new EditDataForbiddenException();
    }
  }
}
