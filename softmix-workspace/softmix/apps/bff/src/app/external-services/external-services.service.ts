import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { UrlPaths } from '@project-lib/shared-types';

@Injectable()
export class ExternalServicesService {
  private readonly serviceAddress: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.serviceAddress = this.configService.get<string>('bff.shopUrl');
  }

  public async findAll(headers) {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.serviceAddress}/${UrlPaths.ExternalServices}`,
        { headers }
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    );

    return data;
  }

  public async findById(id: string, headers) {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.serviceAddress}/${UrlPaths.ExternalServices}/${id}`,
        { headers }
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    );

    return data;
  }

  public async findByName(name: string, headers) {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.serviceAddress}/${UrlPaths.ExternalServices}/by-name/${name}`,
        { headers }
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    );

    return data;
  }

  public async findActive(headers) {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.serviceAddress}/${UrlPaths.ExternalServices}/active`,
        { headers }
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    );

    return data;
  }

  public async create(createData, headers) {
    const { data } = await firstValueFrom(
      this.httpService.post(
        `${this.serviceAddress}/${UrlPaths.ExternalServices}`,
        createData,
        { headers }
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    );

    return data;
  }

  public async update(id: string, updateData, headers) {
    const { data } = await firstValueFrom(
      this.httpService.put(
        `${this.serviceAddress}/${UrlPaths.ExternalServices}/${id}`,
        updateData,
        { headers }
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    );

    return data;
  }

  public async delete(id: string, headers) {
    const { data } = await firstValueFrom(
      this.httpService.delete(
        `${this.serviceAddress}/${UrlPaths.ExternalServices}/${id}`,
        { headers }
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    );

    return data;
  }
}
