import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { UrlPaths } from '@project-lib/shared-types';

@Injectable()
export class SettingsService {
  private readonly serviceAddress: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.serviceAddress = this.configService.get<string>('bff.shopUrl');
  }

  public async get(headers) {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.serviceAddress}/${UrlPaths.Settings}`,
        { headers }
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    );

    return data;
  }

  public async update(updateData, headers) {
    const { data } = await firstValueFrom(
      this.httpService.put(
        `${this.serviceAddress}/${UrlPaths.Settings}`,
        updateData,
        { headers }
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    );

    return data;
  }
}
