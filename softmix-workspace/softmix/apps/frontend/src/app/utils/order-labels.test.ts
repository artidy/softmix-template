import { describe, expect, it } from 'vitest';
import { DeliveryType, OrderStatus, PaymentMethod, PaymentStatus } from '@project-lib/shared-types';

import {
  DELIVERY_LABEL,
  formatOrderAddress,
  ORDER_STATUS_BADGE,
  ORDER_STATUS_LABEL,
  PAYMENT_LABEL,
  PAYMENT_STATUS_BADGE,
  PAYMENT_STATUS_LABEL,
} from './order-labels';

describe('подписи статусов', () => {
  it('у каждого статуса заказа есть подпись и цвет', () => {
    for (const status of Object.values(OrderStatus)) {
      expect(ORDER_STATUS_LABEL[status]).toBeTruthy();
      expect(ORDER_STATUS_BADGE[status]).toBeTruthy();
    }
  });

  it('у каждого статуса оплаты есть подпись и цвет', () => {
    for (const status of Object.values(PaymentStatus)) {
      expect(PAYMENT_STATUS_LABEL[status]).toBeTruthy();
      expect(PAYMENT_STATUS_BADGE[status]).toBeTruthy();
    }
  });

  it('у каждого способа оплаты и доставки есть подпись', () => {
    for (const method of Object.values(PaymentMethod)) {
      expect(PAYMENT_LABEL[method]).toBeTruthy();
    }
    for (const type of Object.values(DeliveryType)) {
      expect(DELIVERY_LABEL[type]).toBeTruthy();
    }
  });
});

describe('formatOrderAddress', () => {
  it('для самовывоза пишет «Самовывоз»', () => {
    expect(formatOrderAddress({ type: DeliveryType.Pickup, cost: 0 })).toBe('Самовывоз');
  });

  it('собирает адрес в строку без пустых частей', () => {
    expect(
      formatOrderAddress({
        type: DeliveryType.Courier,
        cost: 1500,
        address: { city: 'Астана', street: 'Достык', house: '20', apartment: '', postalCode: undefined } as never,
      }),
    ).toBe('Астана, Достык, 20');
  });

  it('без адреса — пустая строка', () => {
    expect(formatOrderAddress({ type: DeliveryType.Sdek, cost: 2000 })).toBe('');
  });
});
