import { OrderApi, PaymentMethod } from '@project-lib/shared-types';

export interface PaymentInitInput {
  order: OrderApi;
  successUrl: string;
  failureUrl: string;
  resultUrl: string;
}

export interface PaymentInitResult {
  redirectUrl: string;
  providerTxId: string;
  rawResponse: Record<string, unknown>;
}

export interface PaymentWebhookResult {
  orderNumber: string;
  providerTxId: string;
  amount: number;
  isSuccess: boolean;
  rawPayload: Record<string, unknown>;
  responseToProvider: string | Record<string, unknown>;
}

export interface PaymentProvider {
  readonly method: PaymentMethod;
  isConfigured(): Promise<boolean>;
  init(input: PaymentInitInput): Promise<PaymentInitResult>;
  handleWebhook(payload: Record<string, unknown>): Promise<PaymentWebhookResult>;
}
