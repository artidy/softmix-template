import { registerAs } from '@nestjs/config';

export const userConfig = registerAs('user', () => ({
  login: process.env.WEB_ADMIN_LOGIN,
  password: process.env.WEB_ADMIN_PASSWORD,
}));
