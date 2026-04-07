import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { CartService } from './cart.service';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { UserDecorator } from '@project-lib/core';
import { UserRequest, CartApi } from '@project-lib/shared-types';
import { JwtAuthGuard } from '../user/guards/jwt-auth.guard';

@ApiTags('cart')
@Controller('cart')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Получить корзину текущего пользователя' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Корзина успешно получена'
  })
  public async getCart(@UserDecorator() user: UserRequest): Promise<CartApi> {
    return this.cartService.getCart(user.id);
  }

  @Post('items')
  @ApiOperation({ summary: 'Добавить товар в корзину' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Товар успешно добавлен в корзину'
  })
  @ApiResponse({
    status: HttpStatus.BAD_REQUEST,
    description: 'Некорректные данные'
  })
  public async addToCart(
    @UserDecorator() user: UserRequest,
    @Body() dto: AddToCartDto
  ): Promise<CartApi> {
    return this.cartService.addToCart(user.id, dto);
  }

  @Patch('items/:productId')
  @ApiOperation({ summary: 'Обновить количество товара в корзине' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Количество товара успешно обновлено'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Товар не найден в корзине'
  })
  public async updateCartItem(
    @UserDecorator() user: UserRequest,
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto
  ): Promise<CartApi> {
    return this.cartService.updateCartItem(user.id, productId, dto);
  }

  @Delete('items/:productId')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Удалить товар из корзины' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Товар успешно удален из корзины'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Товар не найден в корзине'
  })
  public async removeFromCart(
    @UserDecorator() user: UserRequest,
    @Param('productId') productId: string
  ): Promise<CartApi> {
    return this.cartService.removeFromCart(user.id, productId);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Очистить корзину' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Корзина успешно очищена'
  })
  @ApiResponse({
    status: HttpStatus.NOT_FOUND,
    description: 'Корзина не найдена'
  })
  public async clearCart(@UserDecorator() user: UserRequest): Promise<CartApi> {
    return this.cartService.clearCart(user.id);
  }
}
