import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { firstValueFrom } from 'rxjs';
import { UrlPaths } from '@project-lib/shared-types';

@Injectable()
export class UploaderService {
  private readonly serviceAddress: string;
  private readonly uploaderUrl: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.serviceAddress = this.configService.get<string>('bff.uploaderUrl');
    this.uploaderUrl = this.serviceAddress.replace('api', '');
  }

  public async findAll(headers)  {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${this.serviceAddress}/${UrlPaths.Uploader}/${UrlPaths.Products}`,
          {headers}
        )
      );

      return data;
    } catch (e: any) {
      const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = e.response?.data || e.message || 'Service unavailable';
      throw new HttpException(message, status);
    }
  }

  public async findByOwnerId(ownerId, headers) {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get(
          `${this.serviceAddress}/${UrlPaths.Uploader}/${UrlPaths.Products}/${ownerId}`,
          { headers }
        )
      );

      return data;
    } catch (e: any) {
      const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = e.response?.data || e.message || 'Service unavailable';
      throw new HttpException(message, status);
    }
  }

  public async create(ownerId, createData, headers)  {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post(
          `${this.serviceAddress}/${UrlPaths.Uploader}/${UrlPaths.Products}/${ownerId}`,
          createData,
          {headers}
        )
      );

      return { ...data, url: `${this.uploaderUrl}${data.url}` };
    } catch (e: any) {
      const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = e.response?.data || e.message || 'Service unavailable';
      throw new HttpException(message, status);
    }
  }
}
