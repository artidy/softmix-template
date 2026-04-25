import { Injectable, Logger } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PaymentMethod } from '@project-lib/shared-types';

import {
  PaymentInitInput,
  PaymentInitResult,
  PaymentProvider,
  PaymentWebhookResult,
} from '../payment.types';

@Injectable()
export class MockPaymentProvider implements PaymentProvider {
  public readonly method = PaymentMethod.FreedomPay;
  private readonly logger = new Logger(MockPaymentProvider.name);

  public async isConfigured(): Promise<boolean> {
    return true;
  }

  public async init(input: PaymentInitInput): Promise<PaymentInitResult> {
    const providerTxId = `mock-${randomUUID()}`;
    this.logger.log(
      `[MOCK PAYMENT] init order=${input.order.orderNumber} amount=${input.order.totalPrice}`,
    );
    const redirectUrl =
      `${input.successUrl}` +
      (input.successUrl.includes('?') ? '&' : '?') +
      `mock=1&pg_payment_id=${providerTxId}`;
    return {
      redirectUrl,
      providerTxId,
      rawResponse: { mock: true },
    };
  }

  public async handleWebhook(payload: Record<string, unknown>): Promise<PaymentWebhookResult> {
    return {
      orderNumber: String(payload.orderNumber ?? payload.pg_order_id ?? ''),
      providerTxId: String(payload.providerTxId ?? payload.pg_payment_id ?? ''),
      amount: Number(payload.amount ?? payload.pg_amount ?? 0),
      isSuccess: payload.isSuccess === undefined ? true : Boolean(payload.isSuccess),
      rawPayload: payload,
      responseToProvider: { ok: true },
    };
  }
}
