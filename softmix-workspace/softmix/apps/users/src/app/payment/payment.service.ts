import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import {
  OrderStatus,
  PaymentMethod,
  PaymentStatus,
  UserRole,
} from '@project-lib/shared-types';

import { OrderRepository } from '../order/order.repository';
import { OrderEntity } from '../order/order.entity';
import { NotificationService } from '../notifications/notification.service';
import { MailSettingsService } from '../mail-settings/mail-settings.service';
import { FreedomPayProvider } from './providers/freedom-pay.provider';
import { MockPaymentProvider } from './providers/mock.provider';
import { PaymentProvider, PaymentWebhookResult } from './payment.types';
import {
  PaymentTransactionRecord,
  PaymentTransactionRepository,
} from './payment-transaction.repository';

const ONLINE_METHODS: PaymentMethod[] = [
  PaymentMethod.FreedomPay,
  PaymentMethod.KaspiPay,
  PaymentMethod.HalykEpay,
];

export interface InitPaymentResult {
  redirectUrl: string;
  providerTxId: string;
  transactionId: string;
}

@Injectable()
export class PaymentService {
  private readonly logger = new Logger(PaymentService.name);

  constructor(
    private readonly mailSettingsService: MailSettingsService,
    private readonly orderRepository: OrderRepository,
    private readonly transactionRepository: PaymentTransactionRepository,
    private readonly freedomPay: FreedomPayProvider,
    private readonly mockProvider: MockPaymentProvider,
    private readonly notificationService: NotificationService,
  ) {}

  public static isOnlineMethod(method: PaymentMethod): boolean {
    return ONLINE_METHODS.includes(method);
  }

  public async initForOrder(orderId: string, userId: string): Promise<InitPaymentResult> {
    const order = await this.orderRepository.findById(orderId);

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }
    if (order.userId !== userId) {
      throw new ForbiddenException('Нет доступа к этому заказу');
    }
    if (!PaymentService.isOnlineMethod(order.payment.method)) {
      throw new BadRequestException('Этот заказ не требует онлайн-оплаты');
    }
    if (order.payment.status === PaymentStatus.Paid) {
      throw new BadRequestException('Заказ уже оплачен');
    }

    const apiOrder = new OrderEntity(order).toApi();
    const provider = await this.selectProvider(order.payment.method);
    const urls = await this.buildUrls(apiOrder.orderNumber, provider.method);

    const initResult = await provider.init({
      order: apiOrder,
      successUrl: urls.successUrl,
      failureUrl: urls.failureUrl,
      resultUrl: urls.resultUrl,
    });

    const transaction = await this.transactionRepository.create({
      orderId: apiOrder.id,
      orderNumber: apiOrder.orderNumber,
      provider: provider.method,
      providerTxId: initResult.providerTxId,
      amount: apiOrder.totalPrice,
      initPayload: initResult.rawResponse,
    });

    return {
      redirectUrl: initResult.redirectUrl,
      providerTxId: initResult.providerTxId,
      transactionId: transaction.id,
    };
  }

  public async getLatestForOrder(
    orderId: string,
    userId: string,
    role: UserRole,
  ): Promise<PaymentTransactionRecord | null> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }
    const isStaff = role === UserRole.Admin || role === UserRole.Manager;
    if (order.userId !== userId && !isStaff) {
      throw new ForbiddenException('Нет доступа к этому заказу');
    }
    return this.transactionRepository.findLatestByOrderId(orderId);
  }

  public async handleWebhook(
    method: PaymentMethod,
    payload: Record<string, unknown>,
  ): Promise<{ responseToProvider: string | Record<string, unknown> }> {
    const provider = await this.selectProvider(method);
    const result = await provider.handleWebhook(payload);

    const order = await this.orderRepository.findByOrderNumber(result.orderNumber);
    if (!order) {
      this.logger.error(`Webhook: заказ ${result.orderNumber} не найден`);
      throw new NotFoundException('Заказ не найден');
    }

    const transaction = result.providerTxId
      ? await this.transactionRepository.findByProviderTxId(result.providerTxId)
      : await this.transactionRepository.findLatestByOrderId(order._id ?? '');

    if (!transaction) {
      this.logger.error(`Webhook: транзакция для заказа ${result.orderNumber} не найдена`);
      throw new NotFoundException('Транзакция не найдена');
    }

    if (Math.round(result.amount) !== Math.round(order.totalPrice)) {
      this.logger.warn(
        `Webhook: сумма не совпадает (got=${result.amount}, expected=${order.totalPrice})`,
      );
      throw new BadRequestException('Сумма не совпадает');
    }

    const newTxStatus = result.isSuccess ? PaymentStatus.Paid : PaymentStatus.Failed;
    await this.transactionRepository.updateStatus(transaction.id, newTxStatus, result.rawPayload);

    await this.applyOrderStatus(order._id ?? '', result);

    return { responseToProvider: result.responseToProvider };
  }

  private async applyOrderStatus(orderId: string, result: PaymentWebhookResult): Promise<void> {
    const order = await this.orderRepository.findById(orderId);
    if (!order) return;

    const entity = new OrderEntity(order);
    if (result.isSuccess) {
      entity.payment.status = PaymentStatus.Paid;
      entity.payment.paidAt = new Date();
      entity.payment.transactionId = result.providerTxId;
      const previousStatus = entity.status;
      if (entity.status === OrderStatus.Pending) {
        entity.changeStatus(OrderStatus.Paid, undefined, 'Оплата получена');
      }
      const updated = await this.orderRepository.update(orderId, entity);
      if (updated && previousStatus !== entity.status) {
        this.notificationService.notifyOrderStatusChanged(
          new OrderEntity(updated).toApi(),
          previousStatus,
        );
      }
    } else {
      entity.payment.status = PaymentStatus.Failed;
      await this.orderRepository.update(orderId, entity);
    }
  }

  private async selectProvider(method: PaymentMethod): Promise<PaymentProvider> {
    if (method === PaymentMethod.FreedomPay) {
      return (await this.freedomPay.isConfigured()) ? this.freedomPay : this.mockProvider;
    }
    return this.mockProvider;
  }

  private async buildUrls(orderNumber: string, method: PaymentMethod): Promise<{
    successUrl: string;
    failureUrl: string;
    resultUrl: string;
  }> {
    const settings = await this.mailSettingsService.getDecrypted();
    const publicUrl = settings?.shopUrl || 'http://localhost:4200';
    const trimmed = publicUrl.replace(/\/$/, '');
    const successUrl = `${trimmed}/checkout/payment-success?order=${encodeURIComponent(orderNumber)}`;
    const failureUrl = `${trimmed}/checkout/payment-failed?order=${encodeURIComponent(orderNumber)}`;
    const resultUrl = `${trimmed}/api/payments/webhook/${method}`;
    return { successUrl, failureUrl, resultUrl };
  }
}
