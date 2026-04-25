import {
  Body,
  Controller,
  Get,
  Headers,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import {
  CheckoutDto,
  OrderApi,
  OrdersPaginationApi,
  UpdateOrderStatusDto,
  UrlPaths,
} from '@project-lib/shared-types';

import { OrdersService } from './orders.service';

@ApiTags(UrlPaths.Orders)
@ApiBearerAuth()
@Controller(UrlPaths.Orders)
export class OrdersController {
  constructor(private readonly ordersService: OrdersService) {}

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Оформить заказ из корзины текущего пользователя' })
  public async checkout(
    @Body() dto: CheckoutDto,
    @Headers() headers: Record<string, string>,
  ): Promise<OrderApi> {
    return this.ordersService.checkout(dto, headers);
  }

  @Get('my')
  @ApiOperation({ summary: 'Получить заказы текущего пользователя' })
  public async getMyOrders(
    @Query() query: Record<string, unknown>,
    @Headers() headers: Record<string, string>,
  ): Promise<OrdersPaginationApi> {
    return this.ordersService.getMyOrders(headers, query);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все заказы (admin/manager)' })
  public async getAllOrders(
    @Query() query: Record<string, unknown>,
    @Headers() headers: Record<string, string>,
  ): Promise<OrdersPaginationApi> {
    return this.ordersService.getAllOrders(headers, query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить заказ по ID' })
  public async getOrder(
    @Param('id') id: string,
    @Headers() headers: Record<string, string>,
  ): Promise<OrderApi> {
    return this.ordersService.getOrder(id, headers);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Обновить статус заказа (admin/manager)' })
  public async updateStatus(
    @Param('id') id: string,
    @Body() dto: UpdateOrderStatusDto,
    @Headers() headers: Record<string, string>,
  ): Promise<OrderApi> {
    return this.ordersService.updateStatus(id, dto, headers);
  }
}
