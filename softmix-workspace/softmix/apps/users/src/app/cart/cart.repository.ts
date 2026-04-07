import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

import { CartModel } from './cart.model';
import { CartEntity } from './cart.entity';
import { Cart } from '@project-lib/shared-types';

@Injectable()
export class CartRepository {
  constructor(
    @InjectModel(CartModel.name) private readonly cartModel: Model<CartModel>
  ) {}

  public async create(cart: CartEntity): Promise<Cart> {
    const newCart = new this.cartModel(cart.toObject());
    const savedCart = await newCart.save();

    return this.documentToCart(savedCart);
  }

  public async findByUserId(userId: string): Promise<Cart | null> {
    const cart = await this.cartModel.findOne({ userId }).exec();

    if (!cart) {
      return null;
    }

    return this.documentToCart(cart);
  }

  public async update(id: string, cart: CartEntity): Promise<Cart | null> {
    const updatedCart = await this.cartModel
      .findByIdAndUpdate(id, cart.toObject(), { new: true })
      .exec();

    if (!updatedCart) {
      return null;
    }

    return this.documentToCart(updatedCart);
  }

  public async delete(id: string): Promise<void> {
    await this.cartModel.findByIdAndDelete(id).exec();
  }

  public async deleteByUserId(userId: string): Promise<void> {
    await this.cartModel.deleteOne({ userId }).exec();
  }

  private documentToCart(document: CartModel): Cart {
    return {
      _id: document._id.toString(),
      userId: document.userId,
      items: document.items,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt
    };
  }
}
