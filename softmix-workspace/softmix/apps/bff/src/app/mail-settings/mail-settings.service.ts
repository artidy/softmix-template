import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { MailSettingsApi, UpdateMailSettingsDto } from '@project-lib/shared-types';

@Injectable()
export class MailSettingsBffService {
  private readonly serviceAddress: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.serviceAddress = this.configService.get<string>('bff.usersUrl') ?? '';
  }

  public async get(headers: Record<string, string>): Promise<MailSettingsApi> {
    return this.request<MailSettingsApi>('get', '/mail-settings', headers);
  }

  public async update(
    dto: UpdateMailSettingsDto,
    headers: Record<string, string>,
  ): Promise<MailSettingsApi> {
    return this.request<MailSettingsApi>('put', '/mail-settings', headers, dto);
  }

  public async test(
    body: { to?: string },
    headers: Record<string, string>,
  ): Promise<{ ok: true; sentTo: string }> {
    return this.request('post', '/mail-settings/test', headers, body);
  }

  private async request<T>(
    method: 'get' | 'put' | 'post',
    path: string,
    headers: Record<string, string>,
    data?: unknown,
  ): Promise<T> {
    const url = `${this.serviceAddress}${path}`;
    const observable =
      method === 'get'
        ? this.httpService.get<T>(url, { headers })
        : method === 'put'
        ? this.httpService.put<T>(url, data, { headers })
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
