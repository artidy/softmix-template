import { Response, NextFunction } from 'express';
import axios from 'axios';
import { HttpService } from '@nestjs/axios';
import { catchError, firstValueFrom } from 'rxjs';
import { ConfigService } from '@nestjs/config';
import { HttpException, Logger } from '@nestjs/common';

import { ExtendedRequest } from '../request.interface';

export function auth (httpService: HttpService, configService: ConfigService) {
  return async function (req: ExtendedRequest, res: Response, next: NextFunction)
  {
    const authorization = req.headers?.authorization ?? req.headers?.Authorization;

    if (!authorization) {
      return next();
    }

    if (req.user) {
      req.user = undefined;
    }

    const authUrl = configService.get<string>('auth.url') ?? '';

    if (!authUrl) {
      return next();
    }

    try {
      const {data: user} = await firstValueFrom(
        httpService.get(
          authUrl,
          {
            headers: {
              "Content-Type": "application/json",
              "Authorization": authorization
            }
          }
        ).pipe(catchError((e) => {
          if (e && axios.isAxiosError(e) && e.response) {
            Logger.error(`Auth middleware error: ${e.response.status}`, e.response.data);
            throw new HttpException(e.response.data, e.response.status);
          }

          Logger.error('Auth middleware: Unknown error', e);
          throw new HttpException('Неизвестная ошибка', 500);
        }))
      )

      req.user = user;
    } catch (error) {
      // Token is invalid or auth service is unavailable
      // Don't set req.user, let guards handle authorization
      Logger.warn('Auth middleware: Failed to verify token, continuing without user', error instanceof Error ? error.message : 'Unknown error');
    }

    next();
  }
}
