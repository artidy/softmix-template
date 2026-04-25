import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Req,
  Res,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { Request, Response } from 'express';

import { PaymentsService } from './payments.service';

@ApiTags('payments')
@Controller('payments')
export class PaymentsController {
  constructor(private readonly paymentsService: PaymentsService) {}

  @Post('init/:orderId')
  @ApiBearerAuth()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Инициировать оплату заказа' })
  public async init(
    @Param('orderId') orderId: string,
    @Headers() headers: Record<string, string>,
  ) {
    return this.paymentsService.init(orderId, headers);
  }

  @Get(':orderId')
  @ApiBearerAuth()
  @ApiOperation({ summary: 'Статус оплаты заказа' })
  public async getStatus(
    @Param('orderId') orderId: string,
    @Headers() headers: Record<string, string>,
  ) {
    return this.paymentsService.getStatus(orderId, headers);
  }

  @Post('webhook/:provider')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Webhook от платёжного провайдера' })
  public async webhook(
    @Param('provider') provider: string,
    @Body() body: Record<string, unknown>,
    @Query() query: Record<string, unknown>,
    @Req() req: Request,
    @Res() res: Response,
  ): Promise<void> {
    const headers: Record<string, string> = {};
    for (const [key, value] of Object.entries(req.headers)) {
      if (key === 'host' || key === 'content-length') continue;
      if (typeof value === 'string') {
        headers[key] = value;
      }
    }

    const { data, contentType } = await this.paymentsService.webhook(provider, body, headers, query);
    res.setHeader('Content-Type', contentType);
    res.send(data);
  }
}
