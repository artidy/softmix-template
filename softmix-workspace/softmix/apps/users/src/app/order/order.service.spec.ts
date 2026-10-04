import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeliveryType, OrderStatus, PaymentMethod, PaymentStatus, UserRole } from '@project-lib/shared-types';

import { OrderEntity } from './order.entity';
import { OrderService } from './order.service';

const contact = { name: 'Иван', phone: '+77011234567', email: 'ivan@example.com' };

function checkoutDto(deliveryCost = 0) {
  return {
    contact,
    delivery: { type: deliveryCost ? DeliveryType.Courier : DeliveryType.Pickup, cost: deliveryCost },
    payment: { method: PaymentMethod.CashOnDelivery },
  } as never;
}

function storedOrder(patch: Record<string, unknown> = {}) {
  return {
    _id: 'o1',
    orderNumber: 'SM-20261004-1234',
    userId: 'u1',
    items: [],
    totalItems: 1,
    totalPrice: 1000,
    status: OrderStatus.Pending,
    contact,
    delivery: { type: DeliveryType.Pickup, cost: 0 },
    payment: { method: PaymentMethod.CashOnDelivery, status: PaymentStatus.Pending },
    statusHistory: [],
    ...patch,
  };
}

function setup(cartItems: unknown[] = []) {
  const orderRepository = {
    create: jest.fn(async (entity: OrderEntity) => ({ ...entity.toObject(), _id: 'o1' })),
    findById: jest.fn(),
    findByOrderNumber: jest.fn().mockResolvedValue(null),
    update: jest.fn(async (_id: string, entity: OrderEntity) => entity.toObject()),
    findUserOrders: jest.fn(),
    findAll: jest.fn(),
  };
  const cartService = {
    getCart: jest.fn().mockResolvedValue({ items: cartItems }),
    clearCart: jest.fn(),
  };
  const notificationService = { notifyOrderCreated: jest.fn(), notifyOrderStatusChanged: jest.fn() };
  const service = new OrderService(orderRepository as never, cartService as never, {} as never, notificationService as never);
  return { service, orderRepository, cartService, notificationService };
}

describe('OrderService.checkout', () => {
  it('пустая корзина — ошибка', async () => {
    const { service } = setup([]);
    await expect(service.checkout('u1', checkoutDto())).rejects.toBeInstanceOf(BadRequestException);
  });

  it('считает итог вместе с доставкой, очищает корзину и уведомляет', async () => {
    const { service, cartService, notificationService } = setup([
      { productId: 'm1', title: 'Монитор', price: '44472', quantity: 2, imageUrl: '' },
      { productId: 'p1', title: 'Принтер', price: 1000, quantity: 1, imageUrl: '' },
    ]);

    const order = await service.checkout('u1', checkoutDto(1500));

    expect(order.totalItems).toBe(3);
    expect(order.totalPrice).toBe(44472 * 2 + 1000 + 1500);
    expect(order.status).toBe(OrderStatus.Pending);
    expect(order.payment).toEqual({ method: PaymentMethod.CashOnDelivery, status: PaymentStatus.Pending });
    expect(order.statusHistory).toEqual([expect.objectContaining({ status: OrderStatus.Pending, comment: 'Заказ создан' })]);
    expect(order.orderNumber).toMatch(/^SM-\d{8}-\d{4}$/);
    expect(cartService.clearCart).toHaveBeenCalledWith('u1');
    expect(notificationService.notifyOrderCreated).toHaveBeenCalledWith(order);
  });

  it('отбрасывает позиции с битой ценой и округляет количество', async () => {
    const { service } = setup([
      { productId: 'ok', title: 'Норм', price: 100, quantity: 2.6, imageUrl: '' },
      { productId: 'zero', title: 'Ноль штук', price: 50, quantity: 0, imageUrl: '' },
      { productId: 'nan', title: 'Без цены', price: 'abc', quantity: 1, imageUrl: '' },
      { productId: 'neg', title: 'Минус', price: -10, quantity: 1, imageUrl: '' },
    ]);

    const order = await service.checkout('u1', checkoutDto());

    expect(order.items.map((item) => [item.productId, item.quantity])).toEqual([
      ['ok', 3],
      ['zero', 1],
    ]);
    expect(order.totalPrice).toBe(100 * 3 + 50);
  });

  it('корзина только из битых позиций — ошибка', async () => {
    const { service } = setup([{ productId: 'nan', title: 'Без цены', price: 'abc', quantity: 1 }]);
    await expect(service.checkout('u1', checkoutDto())).rejects.toBeInstanceOf(BadRequestException);
  });

  it('при совпадении номера заказа подбирает другой', async () => {
    const { service, orderRepository } = setup([{ productId: 'a', title: 'A', price: 1, quantity: 1 }]);
    orderRepository.findByOrderNumber.mockResolvedValueOnce({ _id: 'existing' }).mockResolvedValue(null);

    await service.checkout('u1', checkoutDto());

    expect(orderRepository.findByOrderNumber).toHaveBeenCalledTimes(2);
  });
});

describe('OrderService.getOrderForUser', () => {
  it('владелец и сотрудники видят заказ', async () => {
    const { service, orderRepository } = setup();
    orderRepository.findById.mockResolvedValue(storedOrder());

    await expect(service.getOrderForUser('u1', 'o1', UserRole.User)).resolves.toMatchObject({ id: 'o1' });
    await expect(service.getOrderForUser('staff', 'o1', UserRole.Manager)).resolves.toMatchObject({ id: 'o1' });
    await expect(service.getOrderForUser('admin', 'o1', UserRole.Admin)).resolves.toMatchObject({ id: 'o1' });
  });

  it('чужой заказ покупателю не отдаётся', async () => {
    const { service, orderRepository } = setup();
    orderRepository.findById.mockResolvedValue(storedOrder());

    await expect(service.getOrderForUser('someone-else', 'o1', UserRole.User)).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('несуществующий заказ', async () => {
    const { service, orderRepository } = setup();
    orderRepository.findById.mockResolvedValue(null);

    await expect(service.getOrderForUser('u1', 'nope', UserRole.User)).rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('OrderService.updateStatus', () => {
  it('записывает историю и уведомляет о смене статуса', async () => {
    const { service, orderRepository, notificationService } = setup();
    orderRepository.findById.mockResolvedValue(storedOrder());

    const order = await service.updateStatus('o1', { status: OrderStatus.Shipped, comment: 'Отправлен СДЭК' }, 'admin');

    expect(order.status).toBe(OrderStatus.Shipped);
    expect(order.statusHistory.at(-1)).toMatchObject({ status: OrderStatus.Shipped, changedBy: 'admin', comment: 'Отправлен СДЭК' });
    expect(notificationService.notifyOrderStatusChanged).toHaveBeenCalledWith(order, OrderStatus.Pending);
  });

  it('тот же статус не шлёт уведомление', async () => {
    const { service, orderRepository, notificationService } = setup();
    orderRepository.findById.mockResolvedValue(storedOrder());

    await service.updateStatus('o1', { status: OrderStatus.Pending }, 'admin');

    expect(notificationService.notifyOrderStatusChanged).not.toHaveBeenCalled();
  });

  it('несуществующий заказ', async () => {
    const { service, orderRepository } = setup();
    orderRepository.findById.mockResolvedValue(null);

    await expect(service.updateStatus('nope', { status: OrderStatus.Paid }, 'admin')).rejects.toBeInstanceOf(NotFoundException);
  });
});

describe('OrderEntity', () => {
  it('toApi подставляет id и даты по умолчанию', () => {
    const api = new OrderEntity({ ...storedOrder(), _id: undefined } as never).toApi();
    expect(api.id).toBe('');
    expect(api.createdAt).toBeInstanceOf(Date);
  });
});
