import { describe, expect, it } from 'vitest';
import {
  CartItem,
  Currency,
  DeliveryType,
  OrderApi,
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
} from '@project-lib/shared-types';

import { DEFAULT_PRODUCT_IMG } from '../../const';
import { toCartApi } from '../guest-cart';
import { cartAdapt } from './cart.adapter';
import { orderAdapt } from './order.adapter';

function item(productId: string, imageUrl?: string): CartItem {
  return { productId, title: 'Товар', price: 1000, quantity: 1, imageUrl };
}

function apiOrder(items: CartItem[]): OrderApi {
  return {
    id: 'o1',
    orderNumber: 'SM-20261004-1234',
    userId: 'u1',
    items,
    totalItems: items.length,
    totalPrice: items.length * 1000,
    currency: Currency.KZT,
    status: OrderStatus.Pending,
    contact: { name: 'Иван', phone: '+77011234567', email: 'ivan@example.com' },
    delivery: { type: DeliveryType.Pickup },
    payment: { method: PaymentMethod.CashOnDelivery, status: PaymentStatus.Pending },
    statusHistory: [],
    createdAt: new Date('2026-10-04T09:00:00Z'),
    updatedAt: new Date('2026-10-04T09:00:00Z'),
  };
}

const saved = [
  item('old-template', 'assets/img/product/1.png'),
  item('old-redesign', '/assets/img/no-photo.svg'),
  item('empty', ''),
  item('missing'),
  item('uploaded', 'assets/img/products/uploaded.png'),
  item('supplier', 'https://supplier.example/photo.jpg'),
];

const expected = [
  DEFAULT_PRODUCT_IMG,
  DEFAULT_PRODUCT_IMG,
  DEFAULT_PRODUCT_IMG,
  DEFAULT_PRODUCT_IMG,
  'assets/img/products/uploaded.png',
  'https://supplier.example/photo.jpg',
];

describe('картинки позиций корзины и заказа', () => {
  it('в корзине прежние заглушки и пустые пути заменяются текущей, настоящие фото остаются', () => {
    expect(cartAdapt(toCartApi(saved))?.items.map((cartItem) => cartItem.imageUrl)).toEqual(expected);
  });

  it('в заказе так же', () => {
    expect(orderAdapt(apiOrder(saved)).items.map((orderItem) => orderItem.imageUrl)).toEqual(expected);
  });
});
