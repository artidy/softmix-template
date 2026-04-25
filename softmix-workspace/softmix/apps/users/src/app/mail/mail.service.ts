import { Injectable, Logger } from '@nestjs/common';
import * as nodemailer from 'nodemailer';
import type { Transporter } from 'nodemailer';
import { OrderApi, OrderStatus } from '@project-lib/shared-types';

import {
  DecryptedMailSettings,
  MailSettingsService,
} from '../mail-settings/mail-settings.service';
import { renderOrderCreatedHtml, renderOrderStatusChangedHtml } from './templates/order.templates';
import { renderEmailVerificationHtml } from './templates/verification.templates';

const SETTINGS_CACHE_TTL_MS = 60 * 1000;

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private cachedSettings: DecryptedMailSettings | null = null;
  private cachedTransporter: Transporter | null = null;
  private cacheKey = '';
  private cacheExpiresAt = 0;

  constructor(private readonly mailSettingsService: MailSettingsService) {}

  public invalidateCache(): void {
    this.cachedSettings = null;
    this.cachedTransporter = null;
    this.cacheKey = '';
    this.cacheExpiresAt = 0;
  }

  public async sendOrderCreatedToCustomer(order: OrderApi): Promise<void> {
    const settings = await this.resolveSettings();
    if (!settings) return;
    const subject = `${settings.shopName}: заказ ${order.orderNumber} принят`;
    const html = renderOrderCreatedHtml(order, settings.shopName);
    await this.send(settings, order.contact.email, subject, html);
  }

  public async sendOrderCreatedToAdmin(order: OrderApi): Promise<void> {
    const settings = await this.resolveSettings();
    if (!settings || !settings.adminEmail) return;
    const subject = `Новый заказ ${order.orderNumber} (${order.totalPrice} ₸)`;
    const html = renderOrderCreatedHtml(order, settings.shopName, true);
    await this.send(settings, settings.adminEmail, subject, html);
  }

  public async sendOrderStatusChangedToCustomer(
    order: OrderApi,
    previousStatus: OrderStatus,
  ): Promise<void> {
    const settings = await this.resolveSettings();
    if (!settings) return;
    const subject = `${settings.shopName}: статус заказа ${order.orderNumber} изменён`;
    const html = renderOrderStatusChangedHtml(order, previousStatus, settings.shopName);
    await this.send(settings, order.contact.email, subject, html);
  }

  public async sendEmailVerification(
    to: string,
    userName: string,
    verificationUrl: string,
  ): Promise<void> {
    const settings = await this.resolveSettings();
    if (!settings) return;
    const subject = `${settings.shopName}: подтвердите регистрацию`;
    const html = renderEmailVerificationHtml(userName, verificationUrl, settings.shopName);
    await this.send(settings, to, subject, html);
  }

  public async sendTestMessage(to: string): Promise<void> {
    const settings = await this.resolveSettings({ ignoreCache: true, ignoreEnabled: true });
    if (!settings) {
      throw new Error('Настройки SMTP не заданы');
    }
    if (!to) {
      throw new Error('Не указан адрес получателя');
    }
    const subject = `${settings.shopName}: тестовое письмо`;
    const html = `<div style="font-family:Arial,sans-serif;padding:20px;">
      <h2>Тестовое письмо</h2>
      <p>Если вы видите это письмо, настройки SMTP работают корректно.</p>
      <p style="color:#666;font-size:13px;">Магазин: ${settings.shopName}</p>
    </div>`;
    await this.deliver(settings, to, subject, html);
  }

  private async resolveSettings(
    options: { ignoreCache?: boolean; ignoreEnabled?: boolean } = {},
  ): Promise<DecryptedMailSettings | null> {
    const now = Date.now();
    if (!options.ignoreCache && this.cachedSettings && now < this.cacheExpiresAt) {
      if (!options.ignoreEnabled && !this.cachedSettings.enabled) return null;
      if (!this.cachedSettings.host) return null;
      return this.cachedSettings;
    }

    const settings = await this.mailSettingsService.getDecrypted();
    if (!settings) return null;

    this.cachedSettings = settings;
    this.cacheExpiresAt = now + SETTINGS_CACHE_TTL_MS;

    if (!options.ignoreEnabled && !settings.enabled) return null;
    if (!settings.host) return null;
    return settings;
  }

  private async send(
    settings: DecryptedMailSettings,
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    if (!to) return;
    try {
      await this.deliver(settings, to, subject, html);
    } catch (error) {
      this.logger.error(`Ошибка отправки письма на ${to}`, error as Error);
    }
  }

  private async deliver(
    settings: DecryptedMailSettings,
    to: string,
    subject: string,
    html: string,
  ): Promise<void> {
    const transporter = this.getOrCreateTransporter(settings);
    await transporter.sendMail({
      from: settings.fromAddress || `no-reply@${settings.host}`,
      to,
      subject,
      html,
    });
  }

  private getOrCreateTransporter(settings: DecryptedMailSettings): Transporter {
    const key = [
      settings.host,
      settings.port,
      settings.secure,
      settings.user,
      settings.password,
    ].join('|');

    if (this.cachedTransporter && this.cacheKey === key) {
      return this.cachedTransporter;
    }

    this.cachedTransporter = nodemailer.createTransport({
      host: settings.host,
      port: settings.port,
      secure: settings.secure,
      auth: settings.user && settings.password
        ? { user: settings.user, pass: settings.password }
        : undefined,
    });
    this.cacheKey = key;

    return this.cachedTransporter;
  }
}
