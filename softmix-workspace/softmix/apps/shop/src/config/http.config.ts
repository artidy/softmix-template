import { ConfigService, registerAs } from '@nestjs/config';
import { HttpModuleAsyncOptions } from '@nestjs/axios';

export const httpConfig = registerAs('http', () => ({
  timeout: process.env.HTTP_TIMEOUT,
  maxRedirects: process.env.HTTP_MAX_REDIRECTS
}));

export function getHttpOptions(): HttpModuleAsyncOptions {
  return {
    useFactory: async (configService: ConfigService) => ({
      timeout: configService.get<number>('http.timeout'),
      maxRedirects: configService.get<number>('http.maxRedirects'),
    }),
    inject: [ConfigService]
  }
}
