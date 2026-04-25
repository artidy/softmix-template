import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseFilters,
  UseGuards,
} from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiResponse, ApiTags } from '@nestjs/swagger';
import {
  EditDataForbiddenException,
  HttpExceptionFilter,
  MongoidValidationPipe,
  UserDecorator,
} from '@project-lib/core';
import {
  OrderApi,
  OrdersPaginationApi,
  UrlPaths,
  UserRequest,
  UserRole,
} from '@project-lib/shared-types';

import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';
import { CheckoutDto } from './dto/checkout.dto';
import { OrdersQueryDto } from './dto/orders.query';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderService } from './order.service';

@UseFilters(HttpExceptionFilter)
@ApiTags(UrlPaths.Orders)
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller(UrlPaths.Orders)
export class OrderController {
  constructor(private readonly orderService: OrderService) {}

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Оформить заказ из корзины текущего пользователя' })
  @ApiResponse({ status: HttpStatus.CREATED, description: 'Заказ создан' })
  @ApiResponse({ status: HttpStatus.BAD_REQUEST, description: 'Корзина пуста или некорректные данные' })
  public async checkout(
    @UserDecorator() user: UserRequest,
    @Body() dto: CheckoutDto,
  ): Promise<OrderApi> {
    return this.orderService.checkout(user.id, dto);
  }

  @Get('my')
  @ApiOperation({ summary: 'Получить заказы текущего пользователя' })
  public async getUserOrders(
    @UserDecorator() user: UserRequest,
    @Query() query: OrdersQueryDto,
  ): Promise<OrdersPaginationApi> {
    return this.orderService.getUserOrders(user.id, query);
  }

  @Get()
  @ApiOperation({ summary: 'Получить все заказы (admin/manager)' })
  public async getAllOrders(
    @UserDecorator() user: UserRequest,
    @Query() query: OrdersQueryDto,
  ): Promise<OrdersPaginationApi> {
    if (user.role !== UserRole.Admin && user.role !== UserRole.Manager) {
      throw new EditDataForbiddenException();
    }
    return this.orderService.getAllOrders(query);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Получить заказ по ID' })
  @ApiResponse({ status: HttpStatus.NOT_FOUND, description: 'Заказ не найден' })
  @ApiResponse({ status: HttpStatus.FORBIDDEN, description: 'Нет доступа к заказу' })
  public async getOrder(
    @UserDecorator() user: UserRequest,
    @Param('id', MongoidValidationPipe) id: string,
  ): Promise<OrderApi> {
    return this.orderService.getOrderForUser(user.id, id, user.role);
  }

  @Patch(':id/status')
  @ApiOperation({ summary: 'Обновить статус заказа (admin/manager)' })
  public async updateStatus(
    @UserDecorator() user: UserRequest,
    @Param('id', MongoidValidationPipe) id: string,
    @Body() dto: UpdateOrderStatusDto,
  ): Promise<OrderApi> {
    if (user.role !== UserRole.Admin && user.role !== UserRole.Manager) {
      throw new EditDataForbiddenException();
    }
    return this.orderService.updateStatus(id, dto, user.id);
  }
}
