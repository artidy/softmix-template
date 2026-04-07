import { registerAs } from '@nestjs/config';
import * as process from 'process';

export const bffConfig = registerAs('bff', () => ({
  shopUrl: process.env.SHOP_URL,
  usersUrl: process.env.USERS_URL,
  uploaderUrl: process.env.UPLOADER_URL,
  alStyleUrl: process.env.AL_STYLE_URL,
  alStyleToken: process.env.AL_STYLE_TOKEN,
}));
