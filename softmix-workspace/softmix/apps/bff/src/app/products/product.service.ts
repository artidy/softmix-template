import { HttpException, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { UrlPaths } from '@project-lib/shared-types';

@Injectable()
export class ProductService {
  private readonly serviceAddress: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.serviceAddress = this.configService.get<string>('bff.shopUrl');
  }

  public async findAll(headers, query)  {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.serviceAddress}/${UrlPaths.Products}`,
        {
          headers,
          params: query,
          paramsSerializer: { indexes: null },
        }
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    )

    return data;
  }

  public async findById(id: string, headers)  {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.serviceAddress}/${UrlPaths.Products}/${id}`,
        {headers}
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    )

    return data;
  }

  public async create(createData, headers)  {
    const { data } = await firstValueFrom(
      this.httpService.post(
        `${this.serviceAddress}/${UrlPaths.Products}`,
        createData,
        {headers}
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    )

    return data;
  }

  public async createMany(createData, headers)  {
    const { data } = await firstValueFrom(
      this.httpService.post(
        `${this.serviceAddress}/${UrlPaths.Products}/many`,
        createData,
        {headers}
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    )

    return data;
  }

  public async update(id, updateData, headers) {
    const { data } = await firstValueFrom(
      this.httpService.patch(
        `${this.serviceAddress}/${UrlPaths.Products}/${id}`,
        updateData,
        {headers}
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    )

    return data;
  }

  public async delete(headers, id) {
    const { data } = await firstValueFrom(
      this.httpService.delete(
        `${this.serviceAddress}/${UrlPaths.Products}/${id}`,
        {headers}
      ).pipe(catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    )

    return data;
  }
}
