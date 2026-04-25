import { BadRequestException, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';
import { createHash, randomBytes } from 'crypto';
import { PaymentMethod } from '@project-lib/shared-types';

import {
  PaymentInitInput,
  PaymentInitResult,
  PaymentProvider,
  PaymentWebhookResult,
} from '../payment.types';
import { PaymentSettingsService } from '../../payment-settings/payment-settings.service';

const SCRIPT_NAME = 'init_payment.php';
const RESULT_SCRIPT_NAME = 'result_url';
const DEFAULT_API_URL = 'https://api.freedompay.kz/init_payment.php';
const SETTINGS_CACHE_TTL_MS = 60 * 1000;

interface ResolvedSettings {
  merchantId: string;
  secret: string;
  apiUrl: string;
  testMode: boolean;
}

@Injectable()
export class FreedomPayProvider implements PaymentProvider {
  public readonly method = PaymentMethod.FreedomPay;
  private readonly logger = new Logger(FreedomPayProvider.name);

  private cachedSettings: ResolvedSettings | null = null;
  private cacheExpiresAt = 0;

  constructor(
    private readonly httpService: HttpService,
    private readonly settingsService: PaymentSettingsService,
  ) {}

  public async isConfigured(): Promise<boolean> {
    const settings = await this.resolveSettings();
    return Boolean(settings.merchantId && settings.secret);
  }

  public async init(input: PaymentInitInput): Promise<PaymentInitResult> {
    const settings = await this.resolveSettings();

    const params: Record<string, string> = {
      pg_merchant_id: settings.merchantId,
      pg_amount: input.order.totalPrice.toFixed(2),
      pg_currency: 'KZT',
      pg_order_id: input.order.orderNumber,
      pg_description: `Заказ ${input.order.orderNumber}`,
      pg_user_phone: input.order.contact.phone.replace(/\D/g, ''),
      pg_user_contact_email: input.order.contact.email,
      pg_result_url: input.resultUrl,
      pg_success_url: input.successUrl,
      pg_failure_url: input.failureUrl,
      pg_request_method: 'POST',
      pg_salt: randomBytes(8).toString('hex'),
      pg_testing_mode: settings.testMode ? '1' : '0',
    };

    params.pg_sig = this.signParams(SCRIPT_NAME, params, settings.secret);

    const formBody = new URLSearchParams(params).toString();
    const { data } = await firstValueFrom(
      this.httpService.post<string>(settings.apiUrl, formBody, {
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        responseType: 'text',
      }),
    );

    const parsed = this.parseXmlResponse(typeof data === 'string' ? data : String(data));

    if (parsed.pg_status !== 'ok' || !parsed.pg_redirect_url) {
      this.logger.error('FreedomPay init failed', parsed);
      throw new BadRequestException(
        parsed.pg_error_description || 'Не удалось инициализировать оплату Freedom Pay',
      );
    }

    return {
      redirectUrl: parsed.pg_redirect_url,
      providerTxId: parsed.pg_payment_id || params.pg_salt,
      rawResponse: parsed,
    };
  }

  public async handleWebhook(payload: Record<string, unknown>): Promise<PaymentWebhookResult> {
    const settings = await this.resolveSettings();
    const secret = settings.secret;
    const incomingSig = String(payload.pg_sig ?? '');
    const calculated = this.signParams(
      RESULT_SCRIPT_NAME,
      this.toStringMap(payload, ['pg_sig']),
      secret,
    );

    if (!incomingSig || incomingSig !== calculated) {
      this.logger.warn(
        `FreedomPay webhook signature mismatch (incoming=${incomingSig}, calculated=${calculated})`,
      );
      throw new BadRequestException('Неверная подпись webhook');
    }

    const orderNumber = String(payload.pg_order_id ?? '');
    const providerTxId = String(payload.pg_payment_id ?? '');
    const amount = Number(payload.pg_amount ?? 0);
    const status = String(payload.pg_result ?? payload.pg_status ?? '');
    const isSuccess = status === '1' || status === 'ok';

    const responseSalt = randomBytes(8).toString('hex');
    const responseParams: Record<string, string> = {
      pg_status: 'ok',
      pg_description: 'Webhook accepted',
      pg_salt: responseSalt,
    };
    responseParams.pg_sig = this.signParams(RESULT_SCRIPT_NAME, responseParams, secret);

    const responseXml = this.toXml('response', responseParams);

    return {
      orderNumber,
      providerTxId,
      amount,
      isSuccess,
      rawPayload: payload,
      responseToProvider: responseXml,
    };
  }

  public invalidateCache(): void {
    this.cachedSettings = null;
    this.cacheExpiresAt = 0;
  }

  private async resolveSettings(): Promise<ResolvedSettings> {
    const now = Date.now();
    if (this.cachedSettings && now < this.cacheExpiresAt) {
      return this.cachedSettings;
    }

    const fromDb = await this.settingsService
      .getDecrypted(PaymentMethod.FreedomPay)
      .catch((error) => {
        this.logger.warn(`Не удалось прочитать настройки FreedomPay из БД: ${(error as Error).message}`);
        return null;
      });

    const settings: ResolvedSettings = {
      merchantId: fromDb?.merchantId ?? '',
      secret: fromDb?.secret ?? '',
      apiUrl: fromDb?.apiUrl || DEFAULT_API_URL,
      testMode: fromDb?.testMode ?? true,
    };

    this.cachedSettings = settings;
    this.cacheExpiresAt = now + SETTINGS_CACHE_TTL_MS;
    return settings;
  }

  private signParams(scriptName: string, params: Record<string, string>, secret: string): string {
    const sortedKeys = Object.keys(params).sort();
    const parts = [scriptName, ...sortedKeys.map((key) => params[key]), secret];
    return createHash('md5').update(parts.join(';')).digest('hex');
  }

  private toStringMap(
    payload: Record<string, unknown>,
    excludeKeys: string[] = [],
  ): Record<string, string> {
    const result: Record<string, string> = {};
    for (const [key, value] of Object.entries(payload)) {
      if (excludeKeys.includes(key)) continue;
      if (value === null || value === undefined) continue;
      result[key] = String(value);
    }
    return result;
  }

  private parseXmlResponse(xml: string): Record<string, string> {
    const result: Record<string, string> = {};
    const tagRegex = /<([a-zA-Z0-9_]+)>([\s\S]*?)<\/\1>/g;
    let match: RegExpExecArray | null;
    while ((match = tagRegex.exec(xml)) !== null) {
      result[match[1]] = match[2].trim();
    }
    return result;
  }

  private toXml(rootTag: string, params: Record<string, string>): string {
    const body = Object.entries(params)
      .map(([key, value]) => `<${key}>${this.escapeXml(value)}</${key}>`)
      .join('');
    return `<?xml version="1.0" encoding="utf-8"?><${rootTag}>${body}</${rootTag}>`;
  }

  private escapeXml(value: string): string {
    return value
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&apos;');
  }
}
