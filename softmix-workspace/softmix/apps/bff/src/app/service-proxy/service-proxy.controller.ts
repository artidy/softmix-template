import { All, Body, Controller, Headers, HttpCode, HttpStatus, Param, Query, Req } from '@nestjs/common';
import { ApiResponse, ApiTags } from '@nestjs/swagger';
import { UrlPaths } from '@project-lib/shared-types';
import { Request } from 'express';

import { ServiceProxyService } from './service-proxy.service';

@ApiTags(UrlPaths.ServiceProxy)
@Controller(UrlPaths.ServiceProxy)
export class ServiceProxyController {
  constructor(private readonly service: ServiceProxyService) {}

  @ApiResponse({ status: HttpStatus.OK, description: 'Проксирование запроса к внешнему сервису' })
  @All(':serviceName')
  @HttpCode(HttpStatus.OK)
  public async proxyRoot(
    @Param('serviceName') serviceName: string,
    @Query() query: Record<string, any>,
    @Body() body: any,
    @Headers() headers: Record<string, any>,
    @Req() req: Request,
  ) {
    return this.dispatch(serviceName, '', query, body, req.method, headers);
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Проксирование запроса к внешнему сервису' })
  @All(':serviceName/*')
  @HttpCode(HttpStatus.OK)
  public async proxyWithPath1(
    @Param('serviceName') serviceName: string,
    @Req() req: Request,
    @Query() query: Record<string, any>,
    @Body() body: any,
    @Headers() headers: Record<string, any>,
  ) {
    const path = this.extractPath(req.path, serviceName);
    return this.dispatch(serviceName, path, query, body, req.method, headers);
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Проксирование запроса к внешнему сервису (вложенный путь)' })
  @All(':serviceName/*/*')
  @HttpCode(HttpStatus.OK)
  public async proxyWithPath2(
    @Param('serviceName') serviceName: string,
    @Req() req: Request,
    @Query() query: Record<string, any>,
    @Body() body: any,
    @Headers() headers: Record<string, any>,
  ) {
    const path = this.extractPath(req.path, serviceName);
    return this.dispatch(serviceName, path, query, body, req.method, headers);
  }

  @ApiResponse({ status: HttpStatus.OK, description: 'Проксирование запроса к внешнему сервису (глубокий путь)' })
  @All(':serviceName/*/*/*')
  @HttpCode(HttpStatus.OK)
  public async proxyWithPath3(
    @Param('serviceName') serviceName: string,
    @Req() req: Request,
    @Query() query: Record<string, any>,
    @Body() body: any,
    @Headers() headers: Record<string, any>,
  ) {
    const path = this.extractPath(req.path, serviceName);
    return this.dispatch(serviceName, path, query, body, req.method, headers);
  }

  private extractPath(requestPath: string, serviceName: string): string {
    const prefix = `/${UrlPaths.ServiceProxy}/${serviceName}/`;
    const index = requestPath.indexOf(prefix);
    return index >= 0 ? requestPath.substring(index + prefix.length) : '';
  }

  private async dispatch(serviceName: string, path: string, query: Record<string, any>, body: any, method: string, headers: Record<string, any>) {
    switch (method.toUpperCase()) {
      case 'GET':
        return this.service.proxyGet(serviceName, path, query, headers);
      case 'POST':
        return this.service.proxyPost(serviceName, path, body, query, headers);
      case 'PUT':
        return this.service.proxyPut(serviceName, path, body, query, headers);
      case 'DELETE':
        return this.service.proxyDelete(serviceName, path, query, headers);
      default:
        return this.service.proxyGet(serviceName, path, query, headers);
    }
  }
}
