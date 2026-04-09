import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom, throttleTime } from 'rxjs';
import { AlStyleRoutes, ProductsQuery } from '@project-lib/shared-types';

/**
 * @deprecated Используйте универсальный прокси /api/service-proxy/:serviceName
 * Настройка внешних сервисов теперь в админ-панели /admin/services
 */
@Injectable()
export class AlstyleService {
  private readonly serviceAddress: string;
  private readonly token: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.serviceAddress = this.configService.get<string>('bff.alStyleUrl') || '';
    this.token = this.configService.get<string>('bff.alStyleToken') || '';
  }

  private checkConfigured() {
    if (!this.serviceAddress || !this.token) {
      throw new HttpException(
        'AlStyle сервис не настроен. Используйте /admin/services для настройки внешних сервисов через универсальный прокси.',
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }
  }

  public async getCategories()  {
    this.checkConfigured();
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.serviceAddress}${AlStyleRoutes.Categories}?access-token=${this.token}`
      ).pipe(throttleTime(5000), catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    )

    return data;
  }

  public async getProducts(categoryId: number, query: ProductsQuery)  {
    this.checkConfigured();
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.serviceAddress}${AlStyleRoutes.Products}?access-token=${this.token}`,
        {
          params: {
            category: categoryId,
            limit: query.limit,
            offset: query.offset,
            additional_fields: 'images'
          }
        }
      ).pipe(throttleTime(5000), catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    )

    return data;
  }

  public async getImages(productId)  {
    this.checkConfigured();
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.serviceAddress}${AlStyleRoutes.Images}?access-token=${this.token}&article=${productId}`
      ).pipe(throttleTime(5000), catchError((e) => {
        throw new HttpException(e.response.data, e.response.status);
      }))
    )

    return data;
  }
}
