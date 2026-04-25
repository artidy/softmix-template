import { PaymentMethod } from './order.interface';

export interface PaymentSettingsApi {
  provider: PaymentMethod;
  enabled: boolean;
  testMode: boolean;
  merchantId: string;
  secret: string;
  apiUrl: string;
  hasMerchantId: boolean;
  hasSecret: boolean;
  hasExtra: boolean;
  updatedBy?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface UpdatePaymentSettingsDto {
  enabled?: boolean;
  testMode?: boolean;
  merchantId?: string;
  secret?: string;
  apiUrl?: string;
  extra?: string;
}
