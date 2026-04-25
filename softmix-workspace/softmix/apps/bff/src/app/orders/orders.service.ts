import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import {
  CheckoutDto,
  OrderApi,
  OrdersPaginationApi,
  UpdateOrderStatusDto,
} from '@project-lib/shared-types';

@Injectable()
export class OrdersService {
  private readonly serviceAddress: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService,
  ) {
    this.serviceAddress = this.configService.get<string>('bff.usersUrl') ?? '';
  }

  public async checkout(dto: CheckoutDto, headers: Record<string, string>): Promise<OrderApi> {
    return this.request<OrderApi>('post', '/orders/checkout', headers, dto);
  }

  public async getMyOrders(
    headers: Record<string, string>,
    query: Record<string, unknown>,
  ): Promise<OrdersPaginationApi> {
    return this.request<OrdersPaginationApi>('get', '/orders/my', headers, undefined, query);
  }

  public async getAllOrders(
    headers: Record<string, string>,
    query: Record<string, unknown>,
  ): Promise<OrdersPaginationApi> {
    return this.request<OrdersPaginationApi>('get', '/orders', headers, undefined, query);
  }

  public async getOrder(id: string, headers: Record<string, string>): Promise<OrderApi> {
    return this.request<OrderApi>('get', `/orders/${id}`, headers);
  }

  public async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    headers: Record<string, string>,
  ): Promise<OrderApi> {
    return this.request<OrderApi>('patch', `/orders/${id}/status`, headers, dto);
  }

  private async request<T>(
    method: 'get' | 'post' | 'patch' | 'delete',
    path: string,
    headers: Record<string, string>,
    data?: unknown,
    params?: Record<string, unknown>,
  ): Promise<T> {
    const url = `${this.serviceAddress}${path}`;
    const config = { headers, params };

    const observable =
      method === 'get'
        ? this.httpService.get<T>(url, config)
        : method === 'delete'
        ? this.httpService.delete<T>(url, config)
        : method === 'post'
        ? this.httpService.post<T>(url, data, config)
        : this.httpService.patch<T>(url, data, config);

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
