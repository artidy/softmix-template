import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';
import { UserDecorator } from '@project-lib/core';
import { PaymentMethod, UserRequest } from '@project-lib/shared-types';

import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { PaymentService } from './payment.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentController {
  constructor(private readonly paymentService: PaymentService) {}

  @Post('init/:orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Инициировать онлайн-оплату заказа' })
  public async init(
    @UserDecorator() user: UserRequest,
    @Param('orderId') orderId: string,
  ) {
    return this.paymentService.initForOrder(orderId, user.id);
  }

  @Get(':orderId')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Последняя транзакция по заказу' })
  public async getStatus(
    @UserDecorator() user: UserRequest,
    @Param('orderId') orderId: string,
  ) {
    const transaction = await this.paymentService.getLatestForOrder(
      orderId,
      user.id,
      user.role,
    );
    return transaction
      ? {
          id: transaction.id,
          orderId: transaction.orderId,
          provider: transaction.provider,
          providerTxId: transaction.providerTxId,
          amount: transaction.amount,
          status: transaction.status,
          createdAt: transaction.createdAt,
          updatedAt: transaction.updatedAt,
        }
      : null;
  }

  @Post('webhook/:provider')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook от платёжного провайдера (без авторизации)' })
  public async webhook(
    @Param('provider') provider: string,
    @Req() req: Request,
    @Res() res: Response,
    @Body() body: Record<string, unknown>,
  ): Promise<void> {
    if (!Object.values(PaymentMethod).includes(provider as PaymentMethod)) {
      throw new BadRequestException('Неизвестный провайдер');
    }

    const payload: Record<string, unknown> = {
      ...(req.query as Record<string, unknown>),
      ...(body || {}),
    };

    const { responseToProvider } = await this.paymentService.handleWebhook(
      provider as PaymentMethod,
      payload,
    );

    if (typeof responseToProvider === 'string') {
      res.setHeader('Content-Type', 'application/xml; charset=utf-8');
      res.send(responseToProvider);
      return;
    }
    res.json(responseToProvider);
  }
}
