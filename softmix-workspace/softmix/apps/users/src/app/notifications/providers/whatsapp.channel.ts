import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import {
  CustomerNotificationChannel,
  OrderCreatedEvent,
  OrderStatusChangedEvent,
} from '../notification.types';
import {
  customerOrderCreatedText,
  customerOrderStatusChangedText,
  formatPrice,
  statusLabel,
} from '../messages';
import { MailSettingsService } from '../../mail-settings/mail-settings.service';

@Injectable()
export class WhatsAppChannel implements CustomerNotificationChannel {
  public readonly name = 'whatsapp';
  private readonly logger = new Logger(WhatsAppChannel.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
    private readonly mailSettingsService: MailSettingsService,
  ) {}

  public isAvailable(): boolean {
    return Boolean(
      this.configService.get<string>('notifications.whatsapp.accessToken') &&
        this.configService.get<string>('notifications.whatsapp.phoneNumberId'),
    );
  }

  public async notifyOrderCreated(event: OrderCreatedEvent): Promise<void> {
    const phone = this.normalizePhone(event.order.contact.phone);
    if (!phone) return;

    const shopName = await this.shopName();
    const templateName = this.configService.get<string>(
      'notifications.whatsapp.templates.orderCreated',
    );

    if (templateName) {
      await this.sendTemplate(phone, templateName, [
        shopName,
        event.order.orderNumber,
        formatPrice(event.order.totalPrice),
        statusLabel(event.order.status),
      ]);
      return;
    }

    await this.sendText(phone, customerOrderCreatedText(event.order, shopName));
  }

  public async notifyOrderStatusChanged(event: OrderStatusChangedEvent): Promise<void> {
    const phone = this.normalizePhone(event.order.contact.phone);
    if (!phone) return;

    const shopName = await this.shopName();
    const templateName = this.configService.get<string>(
      'notifications.whatsapp.templates.orderStatusChanged',
    );

    if (templateName) {
      await this.sendTemplate(phone, templateName, [
        shopName,
        event.order.orderNumber,
        statusLabel(event.previousStatus),
        statusLabel(event.order.status),
      ]);
      return;
    }

    await this.sendText(
      phone,
      customerOrderStatusChangedText(event.order, event.previousStatus, shopName),
    );
  }

  private async sendText(to: string, body: string): Promise<void> {
    await this.callApi({
      messaging_product: 'whatsapp',
      to,
      type: 'text',
      text: { body },
    });
  }

  private async sendTemplate(
    to: string,
    templateName: string,
    params: string[],
  ): Promise<void> {
    const languageCode =
      this.configService.get<string>('notifications.whatsapp.languageCode') ?? 'ru';

    await this.callApi({
      messaging_product: 'whatsapp',
      to,
      type: 'template',
      template: {
        name: templateName,
        language: { code: languageCode },
        components: [
          {
            type: 'body',
            parameters: params.map((value) => ({ type: 'text', text: value })),
          },
        ],
      },
    });
  }

  private async callApi(body: Record<string, unknown>): Promise<void> {
    const apiUrl =
      this.configService.get<string>('notifications.whatsapp.apiUrl') ??
      'https://graph.facebook.com';
    const apiVersion = this.configService.get<string>('notifications.whatsapp.apiVersion');
    const phoneNumberId = this.configService.get<string>('notifications.whatsapp.phoneNumberId');
    const token = this.configService.get<string>('notifications.whatsapp.accessToken');

    const url = `${apiUrl.replace(/\/$/, '')}/${apiVersion}/${phoneNumberId}/messages`;

    await firstValueFrom(
      this.httpService.post(url, body, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      }),
    );
  }

  private async shopName(): Promise<string> {
    const settings = await this.mailSettingsService.getDecrypted();
    return settings?.shopName || 'Softmix';
  }

  private normalizePhone(phone: string): string {
    return phone.replace(/\D/g, '');
  }
}
