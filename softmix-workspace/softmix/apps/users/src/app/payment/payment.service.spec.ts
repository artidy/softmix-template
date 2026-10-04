import { BadRequestException, ForbiddenException, NotFoundException } from '@nestjs/common';
import { DeliveryType, OrderStatus, PaymentMethod, PaymentStatus } from '@project-lib/shared-types';

import { PaymentService } from './payment.service';
import { MockPaymentProvider } from './providers/mock.provider';

function storedOrder(patch: Record<string, unknown> = {}) {
  return {
    _id: 'o1',
    orderNumber: 'SM-1',
    userId: 'u1',
    items: [],
    totalItems: 1,
    totalPrice: 88944,
    status: OrderStatus.Pending,
    contact: { name: 'Иван', phone: '+77011234567', email: 'ivan@example.com' },
    delivery: { type: DeliveryType.Pickup, cost: 0 },
    payment: { method: PaymentMethod.FreedomPay, status: PaymentStatus.Pending },
    statusHistory: [],
    ...patch,
  };
}

type SavedOrder = {
  toObject: () => unknown;
  status: OrderStatus;
  payment: { status: PaymentStatus; transactionId?: string };
  statusHistory: { status: OrderStatus; comment?: string }[];
};

function setup({ mockEnabled = false, freedomConfigured = false } = {}) {
  const orderRepository = {
    findById: jest.fn().mockResolvedValue(storedOrder()),
    findByOrderNumber: jest.fn().mockResolvedValue(storedOrder()),
    update: jest.fn(async (_id: string, entity: SavedOrder) => entity.toObject()),
  };
  const transactionRepository = {
    create: jest.fn().mockResolvedValue({ id: 'tx1' }),
    findByProviderTxId: jest.fn().mockResolvedValue({ id: 'tx1' }),
    findLatestByOrderId: jest.fn().mockResolvedValue({ id: 'tx1' }),
    updateStatus: jest.fn(),
  };
  const freedomPay = {
    method: PaymentMethod.FreedomPay,
    isConfigured: jest.fn().mockResolvedValue(freedomConfigured),
    init: jest.fn().mockResolvedValue({ redirectUrl: 'https://pay/1', providerTxId: 'fp-1', rawResponse: {} }),
    handleWebhook: jest.fn(),
  };
  const mockProvider = new MockPaymentProvider();
  const notificationService = { notifyOrderStatusChanged: jest.fn() };
  const mailSettingsService = { getDecrypted: jest.fn().mockResolvedValue({ shopUrl: 'https://softmix.kz/' }) };
  const configService = { get: jest.fn((key: string) => (key === 'payments.mockEnabled' ? mockEnabled : undefined)) };

  const service = new PaymentService(
    mailSettingsService as never,
    orderRepository as never,
    transactionRepository as never,
    freedomPay as never,
    mockProvider,
    notificationService as never,
    configService as never,
  );
  return { service, orderRepository, transactionRepository, freedomPay, notificationService };
}

describe('PaymentService.initForOrder', () => {
  it('настроенный Freedom Pay получает ссылки возврата на публичный адрес', async () => {
    const { service, freedomPay } = setup({ freedomConfigured: true });

    const result = await service.initForOrder('o1', 'u1');

    expect(result).toEqual({ redirectUrl: 'https://pay/1', providerTxId: 'fp-1', transactionId: 'tx1' });
    expect(freedomPay.init).toHaveBeenCalledWith(
      expect.objectContaining({
        successUrl: 'https://softmix.kz/checkout/payment-success?order=SM-1',
        failureUrl: 'https://softmix.kz/checkout/payment-failed?order=SM-1',
        resultUrl: `https://softmix.kz/api/payments/webhook/${PaymentMethod.FreedomPay}`,
      }),
    );
  });

  it('без настроенной платёжной системы на сервере оплату не начинает', async () => {
    const { service } = setup({ freedomConfigured: false, mockEnabled: false });

    await expect(service.initForOrder('o1', 'u1')).rejects.toThrow('Онлайн-оплата этим способом пока недоступна');
  });

  it('заглушка работает только при явном включении', async () => {
    const { service } = setup({ freedomConfigured: false, mockEnabled: true });

    const result = await service.initForOrder('o1', 'u1');

    expect(result.redirectUrl).toContain('/checkout/payment-success?order=SM-1&mock=1');
  });

  it('чужой заказ оплатить нельзя', async () => {
    const { service } = setup({ freedomConfigured: true });
    await expect(service.initForOrder('o1', 'someone-else')).rejects.toBeInstanceOf(ForbiddenException);
  });

  it('заказ не найден', async () => {
    const { service, orderRepository } = setup({ freedomConfigured: true });
    orderRepository.findById.mockResolvedValue(null);
    await expect(service.initForOrder('nope', 'u1')).rejects.toBeInstanceOf(NotFoundException);
  });

  it('оплата при получении не требует онлайн-оплаты', async () => {
    const { service, orderRepository } = setup({ freedomConfigured: true });
    orderRepository.findById.mockResolvedValue(storedOrder({ payment: { method: PaymentMethod.CashOnDelivery, status: PaymentStatus.Pending } }));
    await expect(service.initForOrder('o1', 'u1')).rejects.toBeInstanceOf(BadRequestException);
  });

  it('уже оплаченный заказ повторно не оплачивается', async () => {
    const { service, orderRepository } = setup({ freedomConfigured: true });
    orderRepository.findById.mockResolvedValue(storedOrder({ payment: { method: PaymentMethod.FreedomPay, status: PaymentStatus.Paid } }));
    await expect(service.initForOrder('o1', 'u1')).rejects.toThrow('Заказ уже оплачен');
  });
});

describe('PaymentService.handleWebhook', () => {
  it('поддельный вебхук без подписи банка отклоняется, если заглушка выключена', async () => {
    const { service, orderRepository, transactionRepository } = setup({ freedomConfigured: false, mockEnabled: false });

    await expect(
      service.handleWebhook(PaymentMethod.KaspiPay, { orderNumber: 'SM-1', amount: 88944, isSuccess: true }),
    ).rejects.toThrow('Онлайн-оплата этим способом пока недоступна');

    expect(transactionRepository.updateStatus).not.toHaveBeenCalled();
    expect(orderRepository.update).not.toHaveBeenCalled();
  });

  it('успешная оплата отмечает заказ оплаченным и пишет историю', async () => {
    const { service, freedomPay, orderRepository, transactionRepository, notificationService } = setup({ freedomConfigured: true });
    freedomPay.handleWebhook.mockResolvedValue({
      orderNumber: 'SM-1',
      providerTxId: 'fp-1',
      amount: 88944,
      isSuccess: true,
      rawPayload: {},
      responseToProvider: '<ok/>',
    });

    await expect(service.handleWebhook(PaymentMethod.FreedomPay, {})).resolves.toEqual({ responseToProvider: '<ok/>' });

    expect(transactionRepository.updateStatus).toHaveBeenCalledWith('tx1', PaymentStatus.Paid, {});
    const saved = orderRepository.update.mock.calls[0][1];
    expect(saved.payment).toMatchObject({ status: PaymentStatus.Paid, transactionId: 'fp-1' });
    expect(saved.status).toBe(OrderStatus.Paid);
    expect(saved.statusHistory.at(-1)).toMatchObject({ status: OrderStatus.Paid, comment: 'Оплата получена' });
    expect(notificationService.notifyOrderStatusChanged).toHaveBeenCalled();
  });

  it('сумма не совпала — оплата не засчитывается', async () => {
    const { service, freedomPay, orderRepository } = setup({ freedomConfigured: true });
    freedomPay.handleWebhook.mockResolvedValue({ orderNumber: 'SM-1', providerTxId: 'fp-1', amount: 1, isSuccess: true, rawPayload: {}, responseToProvider: '' });

    await expect(service.handleWebhook(PaymentMethod.FreedomPay, {})).rejects.toThrow('Сумма не совпадает');
    expect(orderRepository.update).not.toHaveBeenCalled();
  });

  it('неуспешная оплата помечает платёж как ошибку, статус заказа не трогает', async () => {
    const { service, freedomPay, orderRepository, transactionRepository } = setup({ freedomConfigured: true });
    freedomPay.handleWebhook.mockResolvedValue({ orderNumber: 'SM-1', providerTxId: 'fp-1', amount: 88944, isSuccess: false, rawPayload: {}, responseToProvider: '' });

    await service.handleWebhook(PaymentMethod.FreedomPay, {});

    expect(transactionRepository.updateStatus).toHaveBeenCalledWith('tx1', PaymentStatus.Failed, {});
    const saved = orderRepository.update.mock.calls[0][1];
    expect(saved.payment.status).toBe(PaymentStatus.Failed);
    expect(saved.status).toBe(OrderStatus.Pending);
  });

  it('вебхук для неизвестного заказа', async () => {
    const { service, freedomPay, orderRepository } = setup({ freedomConfigured: true });
    freedomPay.handleWebhook.mockResolvedValue({ orderNumber: 'SM-404', providerTxId: '', amount: 1, isSuccess: true, rawPayload: {}, responseToProvider: '' });
    orderRepository.findByOrderNumber.mockResolvedValue(null);

    await expect(service.handleWebhook(PaymentMethod.FreedomPay, {})).rejects.toBeInstanceOf(NotFoundException);
  });
});
