import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  Headers,
  HttpCode,
  HttpStatus
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';

import { CartService } from './cart.service';
import { AddToCartDto, CartApi, UpdateCartItemDto } from '@project-lib/shared-types';

@ApiTags('cart')
@Controller('cart')
@ApiBearerAuth()
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Get()
  @ApiOperation({ summary: 'Получить корзину текущего пользователя' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Корзина успешно получена'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Пользователь не авторизован'
  })
  public async getCart(@Headers() headers: Record<string, string>): Promise<CartApi> {
    return this.cartService.getCart(headers);
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Пользователь не авторизован'
  })
  public async addToCart(
    @Body() dto: AddToCartDto,
    @Headers() headers: Record<string, string>
  ): Promise<CartApi> {
    return this.cartService.addToCart(dto, headers);
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Пользователь не авторизован'
  })
  public async updateCartItem(
    @Param('productId') productId: string,
    @Body() dto: UpdateCartItemDto,
    @Headers() headers: Record<string, string>
  ): Promise<CartApi> {
    return this.cartService.updateCartItem(productId, dto, headers);
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
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Пользователь не авторизован'
  })
  public async removeFromCart(
    @Param('productId') productId: string,
    @Headers() headers: Record<string, string>
  ): Promise<CartApi> {
    return this.cartService.removeFromCart(productId, headers);
  }

  @Delete()
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: 'Очистить корзину' })
  @ApiResponse({
    status: HttpStatus.OK,
    description: 'Корзина успешно очищена'
  })
  @ApiResponse({
    status: HttpStatus.UNAUTHORIZED,
    description: 'Пользователь не авторизован'
  })
  public async clearCart(@Headers() headers: Record<string, string>): Promise<CartApi> {
    return this.cartService.clearCart(headers);
  }
}
