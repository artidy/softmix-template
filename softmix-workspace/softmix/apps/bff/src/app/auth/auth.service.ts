import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { LoginUser } from '@project-lib/shared-types';

@Injectable()
export class AuthService {
  private readonly serviceAddress: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.serviceAddress = this.configService.get<string>('bff.usersUrl');
  }

  public async register(user: any, headers: Record<string, string>): Promise<any> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<any>(
          `${this.serviceAddress}/auth/register`,
          user,
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

  public async login(user: LoginUser, headers: Record<string, string>): Promise<any> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<any>(
          `${this.serviceAddress}/auth/login`,
          user,
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

  public async refresh(headers: Record<string, string>): Promise<any> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.get<any>(
          `${this.serviceAddress}/auth/refresh`,
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

  public async logout(headers: Record<string, string>): Promise<void> {
    try {
      await firstValueFrom(
        this.httpService.delete<void>(
          `${this.serviceAddress}/auth/logout`,
          { headers }
        )
      );
    } catch (e: any) {
      const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = e.response?.data || e.message || 'Service unavailable';
      throw new HttpException(message, status);
    }
  }

  public async verifyEmail(token: string): Promise<{ redirectUrl: string }> {
    try {
      const response = await firstValueFrom(
        this.httpService.get(`${this.serviceAddress}/auth/verify-email`, {
          params: { token },
          maxRedirects: 0,
          validateStatus: (status) => status < 400,
        }),
      );
      const location = response.headers.location || response.headers.Location;
      if (location) {
        return { redirectUrl: String(location) };
      }
      return { redirectUrl: '/' };
    } catch (e: any) {
      if (e.response?.status === 302 || e.response?.status === 301) {
        const location = e.response.headers?.location;
        if (location) return { redirectUrl: String(location) };
      }
      const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = e.response?.data || e.message || 'Service unavailable';
      throw new HttpException(message, status);
    }
  }

  public async resendVerification(
    body: { identifier?: string },
    headers: Record<string, string>,
  ): Promise<any> {
    try {
      const { data } = await firstValueFrom(
        this.httpService.post<any>(
          `${this.serviceAddress}/auth/resend-verification`,
          body,
          { headers },
        ),
      );
      return data;
    } catch (e: any) {
      const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
      const message = e.response?.data || e.message || 'Service unavailable';
      throw new HttpException(message, status);
    }
  }
}
