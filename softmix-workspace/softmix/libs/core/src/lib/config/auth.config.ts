import { registerAs } from '@nestjs/config';

export const authConfig = registerAs('auth', () => ({
  url: process.env.AUTH_SERVICE_URL
}));
