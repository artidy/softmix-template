import { Injectable, Logger } from '@nestjs/common';
import { OrderApi, OrderStatus } from '@project-lib/shared-types';

import { MailService } from '../mail/mail.service';
import {
  AdminNotificationChannel,
  CustomerNotificationChannel,
  OrderCreatedEvent,
  OrderStatusChangedEvent,
} from './notification.types';
import { TelegramChannel } from './providers/telegram.channel';
import { WhatsAppChannel } from './providers/whatsapp.channel';

@Injectable()
export class NotificationService {
  private readonly logger = new Logger(NotificationService.name);
  private readonly customerChannels: CustomerNotificationChannel[];
  private readonly adminChannels: AdminNotificationChannel[];

  constructor(
    private readonly mailService: MailService,
    private readonly whatsApp: WhatsAppChannel,
    private readonly telegram: TelegramChannel,
  ) {
    this.customerChannels = [whatsApp];
    this.adminChannels = [telegram];
  }

  public notifyOrderCreated(order: OrderApi): void {
    const event: OrderCreatedEvent = { order };

    this.runSafely('email:customer', () => this.mailService.sendOrderCreatedToCustomer(order));
    this.runSafely('email:admin', () => this.mailService.sendOrderCreatedToAdmin(order));

    for (const channel of this.customerChannels) {
      if (!channel.isAvailable()) continue;
      this.runSafely(`${channel.name}:customer`, () => channel.notifyOrderCreated(event));
    }

    for (const channel of this.adminChannels) {
      if (!channel.isAvailable()) continue;
      this.runSafely(`${channel.name}:admin`, () => channel.notifyAdminOrderCreated(event));
    }
  }

  public notifyOrderStatusChanged(order: OrderApi, previousStatus: OrderStatus): void {
    const event: OrderStatusChangedEvent = { order, previousStatus };

    this.runSafely('email:customer-status', () =>
      this.mailService.sendOrderStatusChangedToCustomer(order, previousStatus),
    );

    for (const channel of this.customerChannels) {
      if (!channel.isAvailable()) continue;
      this.runSafely(`${channel.name}:status`, () => channel.notifyOrderStatusChanged(event));
    }
  }

  private runSafely(label: string, fn: () => Promise<void>): void {
    fn().catch((error) =>
      this.logger.error(`Не удалось отправить уведомление [${label}]`, error as Error),
    );
  }
}
