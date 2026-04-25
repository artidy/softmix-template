import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import {
  PaymentSettingsApi,
  UpdatePaymentSettingsDto,
} from '@project-lib/shared-types';

@Injectable()
export class PaymentSettingsBffService {
  private readonly serviceAddress: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.serviceAddress = this.configService.get<string>('bff.usersUrl') ?? '';
  }

  public async list(headers: Record<string, string>): Promise<PaymentSettingsApi[]> {
    return this.request<PaymentSettingsApi[]>('get', '/payment-settings', headers);
  }

  public async get(provider: string, headers: Record<string, string>): Promise<PaymentSettingsApi> {
    return this.request<PaymentSettingsApi>('get', `/payment-settings/${provider}`, headers);
  }

  public async update(
    provider: string,
    dto: UpdatePaymentSettingsDto,
    headers: Record<string, string>,
  ): Promise<PaymentSettingsApi> {
    return this.request<PaymentSettingsApi>(
      'put',
      `/payment-settings/${provider}`,
      headers,
      dto,
    );
  }

  private async request<T>(
    method: 'get' | 'put',
    path: string,
    headers: Record<string, string>,
    data?: unknown,
  ): Promise<T> {
    const url = `${this.serviceAddress}${path}`;
    const observable =
      method === 'get'
        ? this.httpService.get<T>(url, { headers })
        : this.httpService.put<T>(url, data, { headers });

    const { data: response } = await firstValueFrom(
      observable.pipe(
        catchError((error: AxiosError) => {
          const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
          const message = error.response?.data || error.message || 'Service unavailable';
          throw new HttpException(message as never, status);
        }),
      ),
    );
    return response;
  }
}
