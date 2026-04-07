import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { AddToCartDto, CartApi, UpdateCartItemDto } from '@project-lib/shared-types';

@Injectable()
export class CartService {
  private readonly serviceAddress: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.serviceAddress = this.configService.get<string>('bff.usersUrl');
  }

  public async getCart(headers: Record<string, string>): Promise<CartApi> {
    const { data } = await firstValueFrom(
      this.httpService.get<CartApi>(
        `${this.serviceAddress}/cart`,
        { headers }
      ).pipe(catchError((e: AxiosError) => {
        const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = e.response?.data || e.message || 'Service unavailable';
        throw new HttpException(message, status);
      }))
    );

    return data;
  }

  public async addToCart(
    dto: AddToCartDto,
    headers: Record<string, string>
  ): Promise<CartApi> {
    const { data } = await firstValueFrom(
      this.httpService.post<CartApi>(
        `${this.serviceAddress}/cart/items`,
        dto,
        { headers }
      ).pipe(catchError((e: AxiosError) => {
        const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = e.response?.data || e.message || 'Service unavailable';
        throw new HttpException(message, status);
      }))
    );

    return data;
  }

  public async updateCartItem(
    productId: string,
    dto: UpdateCartItemDto,
    headers: Record<string, string>
  ): Promise<CartApi> {
    const { data } = await firstValueFrom(
      this.httpService.patch<CartApi>(
        `${this.serviceAddress}/cart/items/${productId}`,
        dto,
        { headers }
      ).pipe(catchError((e: AxiosError) => {
        const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = e.response?.data || e.message || 'Service unavailable';
        throw new HttpException(message, status);
      }))
    );

    return data;
  }

  public async removeFromCart(
    productId: string,
    headers: Record<string, string>
  ): Promise<CartApi> {
    const { data } = await firstValueFrom(
      this.httpService.delete<CartApi>(
        `${this.serviceAddress}/cart/items/${productId}`,
        { headers }
      ).pipe(catchError((e: AxiosError) => {
        const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = e.response?.data || e.message || 'Service unavailable';
        throw new HttpException(message, status);
      }))
    );

    return data;
  }

  public async clearCart(headers: Record<string, string>): Promise<CartApi> {
    const { data } = await firstValueFrom(
      this.httpService.delete<CartApi>(
        `${this.serviceAddress}/cart`,
        { headers }
      ).pipe(catchError((e: AxiosError) => {
        const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = e.response?.data || e.message || 'Service unavailable';
        throw new HttpException(message, status);
      }))
    );

    return data;
  }
}
