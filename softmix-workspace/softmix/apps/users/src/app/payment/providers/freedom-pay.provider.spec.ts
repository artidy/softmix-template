import { BadRequestException } from '@nestjs/common';
import { createHash } from 'crypto';
import { of } from 'rxjs';

import { FreedomPayProvider } from './freedom-pay.provider';

const SECRET = 'test-secret';

/** Подпись Freedom Pay: md5 от «скрипт;значения по алфавиту ключей;секрет». */
function sign(script: string, params: Record<string, string>): string {
  const values = Object.keys(params)
    .sort()
    .map((key) => params[key]);
  return createHash('md5').update([script, ...values, SECRET].join(';')).digest('hex');
}

function setup(settings: Record<string, unknown> | null = { merchantId: '123', secret: SECRET, apiUrl: '', testMode: true }) {
  const httpService = { post: jest.fn() };
  const settingsService = { getDecrypted: jest.fn().mockResolvedValue(settings) };
  const provider = new FreedomPayProvider(httpService as never, settingsService as never);
  return { provider, httpService, settingsService };
}

const order = {
  id: 'o1',
  orderNumber: 'SM-20261004-1234',
  totalPrice: 88944,
  contact: { name: 'Иван', phone: '+7 (701) 123-45-67', email: 'ivan@example.com' },
} as never;

describe('FreedomPayProvider', () => {
  it('без ключей считается ненастроенным', async () => {
    const { provider } = setup({ merchantId: '', secret: '' });
    await expect(provider.isConfigured()).resolves.toBe(false);
  });

  it('init отправляет подписанную форму и возвращает ссылку на оплату', async () => {
    const { provider, httpService } = setup();
    httpService.post.mockReturnValue(
      of({ data: '<response><pg_status>ok</pg_status><pg_payment_id>777</pg_payment_id><pg_redirect_url>https://pay/777</pg_redirect_url></response>' }),
    );

    const result = await provider.init({ order, successUrl: 's', failureUrl: 'f', resultUrl: 'r' });

    expect(result).toMatchObject({ redirectUrl: 'https://pay/777', providerTxId: '777' });
    const [url, body] = httpService.post.mock.calls[0];
    expect(url).toBe('https://api.freedompay.kz/init_payment.php');
    const params = Object.fromEntries(new URLSearchParams(body as string));
    expect(params).toMatchObject({ pg_merchant_id: '123', pg_amount: '88944.00', pg_order_id: 'SM-20261004-1234', pg_user_phone: '77011234567', pg_testing_mode: '1' });
    const { pg_sig, ...signed } = params;
    expect(pg_sig).toBe(sign('init_payment.php', signed));
  });

  it('понимает настоящий формат ответа: XML-заголовок, переносы строк, экранирование и CDATA', async () => {
    const { provider, httpService } = setup();
    httpService.post.mockReturnValue(
      of({
        data: `<?xml version="1.0" encoding="utf-8"?>
<response>
  <pg_status>ok</pg_status>
  <pg_payment_id>888</pg_payment_id>
  <pg_redirect_url>https://customer.freedompay.kz/pay?customer=abc&amp;lang=ru</pg_redirect_url>
  <pg_redirect_url_type><![CDATA[need data]]></pg_redirect_url_type>
</response>`,
      }),
    );

    const result = await provider.init({ order, successUrl: 's', failureUrl: 'f', resultUrl: 'r' });

    expect(result.redirectUrl).toBe('https://customer.freedompay.kz/pay?customer=abc&lang=ru');
    expect(result.rawResponse).toMatchObject({ pg_redirect_url_type: 'need data' });
  });

  it('ошибка платёжной системы при init — понятное исключение', async () => {
    const { provider, httpService } = setup();
    httpService.post.mockReturnValue(of({ data: '<response><pg_status>error</pg_status><pg_error_description>Неверный мерчант</pg_error_description></response>' }));

    await expect(provider.init({ order, successUrl: 's', failureUrl: 'f', resultUrl: 'r' })).rejects.toThrow('Неверный мерчант');
  });

  it('принимает вебхук с верной подписью', async () => {
    const { provider } = setup();
    const payload: Record<string, string> = { pg_order_id: 'SM-1', pg_payment_id: '777', pg_amount: '88944', pg_result: '1', pg_salt: 'abc' };
    payload.pg_sig = sign('result_url', payload);

    const result = await provider.handleWebhook(payload);

    expect(result).toMatchObject({ orderNumber: 'SM-1', providerTxId: '777', amount: 88944, isSuccess: true });
    // Ответ платёжной системе тоже подписан.
    const xml = String(result.responseToProvider);
    const values = Object.fromEntries([...xml.matchAll(/<(pg_[a-z_]+)>([^<]*)<\/\1>/g)].map((match) => [match[1], match[2]]));
    const { pg_sig, ...signed } = values;
    expect(pg_sig).toBe(sign('result_url', signed));
  });

  it('неуспешный платёж распознаётся', async () => {
    const { provider } = setup();
    const payload: Record<string, string> = { pg_order_id: 'SM-1', pg_amount: '10', pg_result: '0', pg_salt: 'x' };
    payload.pg_sig = sign('result_url', payload);

    await expect(provider.handleWebhook(payload)).resolves.toMatchObject({ isSuccess: false });
  });

  it.each([
    ['без подписи', (payload: Record<string, string>) => ({ ...payload, pg_sig: '' })],
    ['с поддельной подписью', (payload: Record<string, string>) => ({ ...payload, pg_sig: 'deadbeef' })],
    ['с изменённой суммой', (payload: Record<string, string>) => ({ ...payload, pg_amount: '1' })],
  ])('отклоняет вебхук %s', async (_name, tamper) => {
    const { provider } = setup();
    const payload: Record<string, string> = { pg_order_id: 'SM-1', pg_amount: '88944', pg_result: '1', pg_salt: 'abc' };
    payload.pg_sig = sign('result_url', payload);

    await expect(provider.handleWebhook(tamper(payload))).rejects.toBeInstanceOf(BadRequestException);
  });
});
