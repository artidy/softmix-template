import { Injectable, NotFoundException } from '@nestjs/common';

import { CartRepository } from './cart.repository';
import { CartEntity } from './cart.entity';
import { AddToCartDto } from './dto/add-to-cart.dto';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { CartApi } from '@project-lib/shared-types';

@Injectable()
export class CartService {
  constructor(
    private readonly cartRepository: CartRepository
  ) {}

  public async getCart(userId: string): Promise<CartApi> {
    const cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      // Create empty cart if not exists
      const newCart = new CartEntity({
        userId,
        items: []
      });

      const createdCart = await this.cartRepository.create(newCart);
      return new CartEntity(createdCart).toApi();
    }

    return new CartEntity(cart).toApi();
  }

  public async addToCart(userId: string, dto: AddToCartDto): Promise<CartApi> {
    let cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      // Create new cart with first item
      const newCart = new CartEntity({
        userId,
        items: [dto]
      });

      const createdCart = await this.cartRepository.create(newCart);
      return new CartEntity(createdCart).toApi();
    }

    // Add item to existing cart
    const cartEntity = new CartEntity(cart);
    cartEntity.addItem(dto);

    const updatedCart = await this.cartRepository.update(cart._id!, cartEntity);

    if (!updatedCart) {
      throw new NotFoundException('Корзина не найдена');
    }

    return new CartEntity(updatedCart).toApi();
  }

  public async updateCartItem(
    userId: string,
    productId: string,
    dto: UpdateCartItemDto
  ): Promise<CartApi> {
    const cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      throw new NotFoundException('Корзина не найдена');
    }

    const cartEntity = new CartEntity(cart);
    const updated = cartEntity.updateItemQuantity(productId, dto.quantity);

    if (!updated) {
      throw new NotFoundException('Товар не найден в корзине');
    }

    const updatedCart = await this.cartRepository.update(cart._id!, cartEntity);

    if (!updatedCart) {
      throw new NotFoundException('Не удалось обновить корзину');
    }

    return new CartEntity(updatedCart).toApi();
  }

  public async removeFromCart(userId: string, productId: string): Promise<CartApi> {
    const cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      throw new NotFoundException('Корзина не найдена');
    }

    const cartEntity = new CartEntity(cart);
    const removed = cartEntity.removeItem(productId);

    if (!removed) {
      throw new NotFoundException('Товар не найден в корзине');
    }

    const updatedCart = await this.cartRepository.update(cart._id!, cartEntity);

    if (!updatedCart) {
      throw new NotFoundException('Не удалось обновить корзину');
    }

    return new CartEntity(updatedCart).toApi();
  }

  public async clearCart(userId: string): Promise<CartApi> {
    const cart = await this.cartRepository.findByUserId(userId);

    if (!cart) {
      throw new NotFoundException('Корзина не найдена');
    }

    const cartEntity = new CartEntity(cart);
    cartEntity.clear();

    const updatedCart = await this.cartRepository.update(cart._id!, cartEntity);

    if (!updatedCart) {
      throw new NotFoundException('Не удалось очистить корзину');
    }

    return new CartEntity(updatedCart).toApi();
  }

  public async deleteCart(userId: string): Promise<void> {
    await this.cartRepository.deleteByUserId(userId);
  }
}
