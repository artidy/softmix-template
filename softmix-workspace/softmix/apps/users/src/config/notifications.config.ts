import { registerAs } from '@nestjs/config';

export const notificationsConfig = registerAs('notifications', () => ({
  whatsapp: {
    accessToken: process.env.WHATSAPP_ACCESS_TOKEN || '',
    phoneNumberId: process.env.WHATSAPP_PHONE_NUMBER_ID || '',
    apiVersion: process.env.WHATSAPP_API_VERSION || 'v18.0',
    apiUrl: process.env.WHATSAPP_API_URL || 'https://graph.facebook.com',
    languageCode: process.env.WHATSAPP_LANGUAGE_CODE || 'ru',
    templates: {
      orderCreated: process.env.WHATSAPP_TEMPLATE_ORDER_CREATED || '',
      orderStatusChanged: process.env.WHATSAPP_TEMPLATE_ORDER_STATUS_CHANGED || '',
    },
  },
  telegram: {
    botToken: process.env.TELEGRAM_BOT_TOKEN || '',
    adminChatId: process.env.TELEGRAM_ADMIN_CHAT_ID || '',
  },
}));
