import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { catchError, firstValueFrom } from 'rxjs';
import { AuthType, ExternalService, UrlPaths } from '@project-lib/shared-types';
import { AxiosRequestConfig } from 'axios';

@Injectable()
export class ServiceProxyService {
  private readonly shopUrl: string;
  private readonly logger = new Logger(ServiceProxyService.name);

  constructor(
    private readonly httpService: HttpService,
    private readonly configService: ConfigService
  ) {
    this.shopUrl = this.configService.get<string>('bff.shopUrl');
  }

  private async getServiceConfig(serviceName: string): Promise<ExternalService> {
    const { data } = await firstValueFrom(
      this.httpService.get(
        `${this.shopUrl}/${UrlPaths.ExternalServices}/by-name/${serviceName}`
      ).pipe(catchError((e) => {
        throw new HttpException(
          `Сервис "${serviceName}" не найден`,
          e.response?.status || HttpStatus.NOT_FOUND
        );
      }))
    );

    if (!data.isActive) {
      throw new HttpException(
        `Сервис "${serviceName}" отключён`,
        HttpStatus.SERVICE_UNAVAILABLE
      );
    }

    return data;
  }

  private buildRequestConfig(
    service: ExternalService,
    path: string,
    query: Record<string, any>,
    incomingHeaders?: Record<string, any>,
  ): { url: string; config: AxiosRequestConfig } {
    const basePath = service.basePath ? `/${service.basePath.replace(/^\//, '')}` : '';
    const url = `${service.baseUrl}${basePath}${path ? `/${path}` : ''}`;

    const config: AxiosRequestConfig = {
      params: { ...query },
      timeout: service.timeout || 15000,
      headers: {},
    };

    // Прокидываем заголовки клиента (кроме служебных)
    if (service.forwardHeaders && incomingHeaders) {
      const excluded = ['host', 'connection', 'content-length', 'transfer-encoding'];
      for (const [key, value] of Object.entries(incomingHeaders)) {
        if (!excluded.includes(key.toLowerCase())) {
          config.headers[key] = value;
        }
      }
    }

    // Кастомные заголовки из настроек сервиса
    if (service.headers?.length) {
      for (const header of service.headers) {
        if (header.key && header.value) {
          config.headers[header.key] = header.value;
        }
      }
    }

    // Авторизация
    switch (service.authType) {
      case AuthType.Bearer:
        config.headers['Authorization'] = `Bearer ${service.authToken}`;
        break;

      case AuthType.QueryParam:
        config.params[service.authParamName || 'access-token'] = service.authToken;
        break;

      case AuthType.ApiKey:
        config.headers[service.authParamName || 'X-API-Key'] = service.authToken;
        break;

      case AuthType.BasicAuth:
        config.headers['Authorization'] = `Basic ${Buffer.from(service.authToken).toString('base64')}`;
        break;
    }

    return { url, config };
  }

  public async proxyGet(serviceName: string, path: string, query: Record<string, any>, incomingHeaders?: Record<string, any>) {
    const service = await this.getServiceConfig(serviceName);
    const { url, config } = this.buildRequestConfig(service, path, query, incomingHeaders);

    this.logger.log(`Proxy GET → ${url}`);

    const { data } = await firstValueFrom(
      this.httpService.get(url, config).pipe(catchError((e) => {
        throw new HttpException(
          e.response?.data || `Ошибка запроса к сервису "${serviceName}"`,
          e.response?.status || HttpStatus.BAD_GATEWAY
        );
      }))
    );

    return data;
  }

  public async proxyPost(serviceName: string, path: string, body: any, query: Record<string, any>, incomingHeaders?: Record<string, any>) {
    const service = await this.getServiceConfig(serviceName);
    const { url, config } = this.buildRequestConfig(service, path, query, incomingHeaders);

    this.logger.log(`Proxy POST → ${url}`);

    const { data } = await firstValueFrom(
      this.httpService.post(url, body, config).pipe(catchError((e) => {
        throw new HttpException(
          e.response?.data || `Ошибка запроса к сервису "${serviceName}"`,
          e.response?.status || HttpStatus.BAD_GATEWAY
        );
      }))
    );

    return data;
  }

  public async proxyPut(serviceName: string, path: string, body: any, query: Record<string, any>, incomingHeaders?: Record<string, any>) {
    const service = await this.getServiceConfig(serviceName);
    const { url, config } = this.buildRequestConfig(service, path, query, incomingHeaders);

    this.logger.log(`Proxy PUT → ${url}`);

    const { data } = await firstValueFrom(
      this.httpService.put(url, body, config).pipe(catchError((e) => {
        throw new HttpException(
          e.response?.data || `Ошибка запроса к сервису "${serviceName}"`,
          e.response?.status || HttpStatus.BAD_GATEWAY
        );
      }))
    );

    return data;
  }

  public async proxyDelete(serviceName: string, path: string, query: Record<string, any>, incomingHeaders?: Record<string, any>) {
    const service = await this.getServiceConfig(serviceName);
    const { url, config } = this.buildRequestConfig(service, path, query, incomingHeaders);

    this.logger.log(`Proxy DELETE → ${url}`);

    const { data } = await firstValueFrom(
      this.httpService.delete(url, config).pipe(catchError((e) => {
        throw new HttpException(
          e.response?.data || `Ошибка запроса к сервису "${serviceName}"`,
          e.response?.status || HttpStatus.BAD_GATEWAY
        );
      }))
    );

    return data;
  }
}
