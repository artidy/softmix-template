import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { AxiosError } from 'axios';
import { catchError, firstValueFrom } from 'rxjs';
import { LoginUser, UrlPaths, User, UserApi, UserRequest } from '@project-lib/shared-types';

@Injectable()
export class UsersService {
  private readonly serviceAddress: string;

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.serviceAddress = this.configService.get<string>('bff.usersUrl');
  }

  public async verify(headers: Record<string, string>): Promise<UserRequest> {
    const { data } = await firstValueFrom(
      this.httpService.get<UserRequest>(
        `${this.serviceAddress}/${UrlPaths.Users}/${UrlPaths.Verify}`,
        {headers}
      ).pipe(catchError((e: AxiosError) => {
        const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = e.response?.data || e.message || 'Service unavailable';
        throw new HttpException(message, status);
      }))
    )

    return data;
  }

  public async register(user: Partial<User>, headers: Record<string, string>): Promise<UserApi> {
    const { data } = await firstValueFrom(
      this.httpService.post<UserApi>(
        `${this.serviceAddress}/${UrlPaths.Users}`,
        user,
        {headers}
      ).pipe(catchError((e: AxiosError) => {
        const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = e.response?.data || e.message || 'Service unavailable';
        throw new HttpException(message, status);
      }))
    )

    return data;
  }

  public async login(user: LoginUser, headers: Record<string, string>): Promise<{ accessToken: string; refreshToken: string; expiresIn: string }> {
    const { data } = await firstValueFrom(
      this.httpService.post<{ accessToken: string; refreshToken: string; expiresIn: string }>(
        `${this.serviceAddress}/${UrlPaths.Auth}/${UrlPaths.Login}`,
        user,
        {headers}
      ).pipe(catchError((e: AxiosError) => {
        const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = e.response?.data || e.message || 'Service unavailable';
        throw new HttpException(message, status);
      }))
    )

    return data;
  }

  public async update(userId: string, updateData: Partial<User>, headers: Record<string, string>): Promise<UserApi> {
    const { data } = await firstValueFrom(
      this.httpService.patch<UserApi>(
        `${this.serviceAddress}/${UrlPaths.Users}/${userId}`,
        updateData,
        {headers}
      ).pipe(catchError((e: AxiosError) => {
        const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = e.response?.data || e.message || 'Service unavailable';
        throw new HttpException(message, status);
      }))
    )

    return data;
  }

  public async refresh(headers: Record<string, string>): Promise<{ accessToken: string; refreshToken: string; expiresIn: string }> {
    const { data } = await firstValueFrom(
      this.httpService.get<{ accessToken: string; refreshToken: string; expiresIn: string }>(
        `${this.serviceAddress}/${UrlPaths.Auth}/${UrlPaths.Refresh}`,
        {headers}
      ).pipe(catchError((e: AxiosError) => {
        const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = e.response?.data || e.message || 'Service unavailable';
        throw new HttpException(message, status);
      }))
    )

    return data;
  }

  public async getAll(headers: Record<string, string>): Promise<UserApi[]> {
    const { data } = await firstValueFrom(
      this.httpService.get<UserApi[]>(
        `${this.serviceAddress}/${UrlPaths.Users}`,
        {headers}
      ).pipe(catchError((e: AxiosError) => {
        const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = e.response?.data || e.message || 'Service unavailable';
        throw new HttpException(message, status);
      }))
    )

    return data;
  }

  public async getById(id: string, headers: Record<string, string>): Promise<UserApi> {
    const { data } = await firstValueFrom(
      this.httpService.get<UserApi>(
        `${this.serviceAddress}/${UrlPaths.Users}/${id}`,
        {headers}
      ).pipe(catchError((e: AxiosError) => {
        const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = e.response?.data || e.message || 'Service unavailable';
        throw new HttpException(message, status);
      }))
    )

    return data;
  }

  public async delete(headers: Record<string, string>, id: string): Promise<void> {
    const { data } = await firstValueFrom(
      this.httpService.delete<void>(
        `${this.serviceAddress}/${UrlPaths.Users}/${id}`,
        {headers}
      ).pipe(catchError((e: AxiosError) => {
        const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = e.response?.data || e.message || 'Service unavailable';
        throw new HttpException(message, status);
      }))
    )

    return data;
  }

  public async logout(headers: Record<string, string>): Promise<void> {
    const { data } = await firstValueFrom(
      this.httpService.delete<void>(
        `${this.serviceAddress}/${UrlPaths.Auth}/${UrlPaths.Logout}`,
        {headers}
      ).pipe(catchError((e: AxiosError) => {
        const status = e.response?.status || HttpStatus.INTERNAL_SERVER_ERROR;
        const message = e.response?.data || e.message || 'Service unavailable';
        throw new HttpException(message, status);
      }))
    )

    return data;
  }
}
