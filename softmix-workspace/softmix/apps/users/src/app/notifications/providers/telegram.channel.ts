import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

import { AdminNotificationChannel, OrderCreatedEvent } from '../notification.types';
import { adminOrderCreatedText } from '../messages';

@Injectable()
export class TelegramChannel implements AdminNotificationChannel {
  public readonly name = 'telegram';
  private readonly logger = new Logger(TelegramChannel.name);

  constructor(
    private readonly configService: ConfigService,
    private readonly httpService: HttpService,
  ) {}

  public isAvailable(): boolean {
    return Boolean(
      this.configService.get<string>('notifications.telegram.botToken') &&
        this.configService.get<string>('notifications.telegram.adminChatId'),
    );
  }

  public async notifyAdminOrderCreated(event: OrderCreatedEvent): Promise<void> {
    const token = this.configService.get<string>('notifications.telegram.botToken');
    const chatId = this.configService.get<string>('notifications.telegram.adminChatId');

    if (!token || !chatId) return;

    const url = `https://api.telegram.org/bot${token}/sendMessage`;
    await firstValueFrom(
      this.httpService.post(url, {
        chat_id: chatId,
        text: adminOrderCreatedText(event.order),
        disable_web_page_preview: true,
      }),
    );
  }
}
