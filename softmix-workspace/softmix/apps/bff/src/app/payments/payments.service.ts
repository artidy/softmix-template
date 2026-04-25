import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';

@Injectable()
export class PaymentsService {
  private readonly serviceAddress: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.serviceAddress = this.configService.get<string>('bff.usersUrl') ?? '';
  }

  public async init(orderId: string, headers: Record<string, string>) {
    return this.request<{ redirectUrl: string; providerTxId: string; transactionId: string }>(
      'post',
      `/payments/init/${orderId}`,
      headers,
    );
  }

  public async getStatus(orderId: string, headers: Record<string, string>) {
    return this.request('get', `/payments/${orderId}`, headers);
  }

  public async webhook(
    provider: string,
    body: unknown,
    headers: Record<string, string>,
    query: Record<string, unknown>,
  ): Promise<{ data: unknown; contentType: string }> {
    const url = `${this.serviceAddress}/payments/webhook/${provider}`;
    const response = await firstValueFrom(
      this.httpService
        .post(url, body, {
          headers,
          params: query,
          responseType: 'text',
          transformResponse: (data) => data,
        })
        .pipe(
          catchError((error: AxiosError) => {
            const status = error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
            const message = error.response?.data || error.message || 'Service unavailable';
            throw new HttpException(message as never, status);
          }),
        ),
    );
    return {
      data: response.data,
      contentType: String(response.headers['content-type'] ?? 'application/json'),
    };
  }

  private async request<T>(
    method: 'get' | 'post',
    path: string,
    headers: Record<string, string>,
    data?: unknown,
  ): Promise<T> {
    const url = `${this.serviceAddress}${path}`;
    const observable =
      method === 'get'
        ? this.httpService.get<T>(url, { headers })
        : this.httpService.post<T>(url, data ?? {}, { headers });

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
