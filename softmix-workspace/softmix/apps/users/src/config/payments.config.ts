import { registerAs } from '@nestjs/config';

// Заглушка онлайн-оплаты подтверждает платёж без подписи банка — её включают только явно, для разработки.
// Иначе любой мог бы отправить «вебхук» и отметить свой заказ оплаченным.
export const paymentsConfig = registerAs('payments', () => ({
  mockEnabled: process.env.PAYMENT_MOCK_ENABLED === 'true',
}));
