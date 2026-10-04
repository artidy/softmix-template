import { HttpException, HttpStatus } from '@nestjs/common';
import { of, throwError } from 'rxjs';
import { AuthType, ExternalService } from '@project-lib/shared-types';

import { ServiceProxyService } from './service-proxy.service';

function service(patch: Partial<ExternalService> = {}): ExternalService {
  return {
    id: 's1',
    name: 'alstyle',
    baseUrl: 'https://api.al-style.kz',
    basePath: '/api',
    authType: AuthType.None,
    authToken: '',
    authParamName: '',
    headers: [],
    timeout: 0,
    forwardHeaders: false,
    isActive: true,
    description: '',
    ...patch,
  } as ExternalService;
}

type UpstreamCall = [string, { params: Record<string, unknown>; headers: Record<string, string>; timeout: number }];

function setup(config: ExternalService | null) {
  const httpService = {
    get: jest.fn((url: string) =>
      url.includes('/external-services/by-name/')
        ? config
          ? of({ data: config })
          : throwError(() => ({ response: { status: 404 } }))
        : of({ data: { ok: true } }),
    ),
    post: jest.fn(() => of({ data: { created: true } })),
    put: jest.fn(() => of({ data: { updated: true } })),
    delete: jest.fn(() => of({ data: { deleted: true } })),
  };
  const configService = { get: jest.fn(() => 'http://softmix.shop:4444/api') };
  const proxy = new ServiceProxyService(httpService as never, configService as never);
  const upstreamCall = (method: 'get' | 'post' | 'put' | 'delete' = 'get') => {
    const calls = (httpService[method].mock.calls as unknown[][]).filter(
      (call) => !String(call[0]).includes('/external-services/by-name/'),
    );
    return calls[0] as unknown as UpstreamCall;
  };
  return { proxy, httpService, upstreamCall };
}

describe('ServiceProxyService', () => {
  it('собирает адрес из базового URL, префикса и пути', async () => {
    const { proxy, upstreamCall } = setup(service());

    await expect(proxy.proxyGet('alstyle', 'categories', { limit: 5 })).resolves.toEqual({ ok: true });

    const [url, config] = upstreamCall();
    expect(url).toBe('https://api.al-style.kz/api/categories');
    expect(config).toMatchObject({ params: { limit: 5 }, timeout: 15000 });
  });

  it('Bearer-токен уходит в заголовок Authorization', async () => {
    const { proxy, upstreamCall } = setup(service({ authType: AuthType.Bearer, authToken: 'secret' }));
    await proxy.proxyGet('alstyle', 'x', {});
    expect(upstreamCall()[1].headers.Authorization).toBe('Bearer secret');
  });

  it('токен в параметре запроса — по умолчанию access-token', async () => {
    const { proxy, upstreamCall } = setup(service({ authType: AuthType.QueryParam, authToken: 'secret' }));
    await proxy.proxyGet('alstyle', 'x', { page: 1 });
    expect(upstreamCall()[1].params).toEqual({ page: 1, 'access-token': 'secret' });
  });

  it('API-ключ уходит в заданный заголовок', async () => {
    const { proxy, upstreamCall } = setup(service({ authType: AuthType.ApiKey, authToken: 'key', authParamName: 'X-Token' }));
    await proxy.proxyGet('alstyle', 'x', {});
    expect(upstreamCall()[1].headers['X-Token']).toBe('key');
  });

  it('Basic Auth кодируется в base64', async () => {
    const { proxy, upstreamCall } = setup(service({ authType: AuthType.BasicAuth, authToken: 'user:pass' }));
    await proxy.proxyGet('alstyle', 'x', {});
    expect(upstreamCall()[1].headers.Authorization).toBe(`Basic ${Buffer.from('user:pass').toString('base64')}`);
  });

  it('прокидывает заголовки клиента без служебных и добавляет свои', async () => {
    const { proxy, upstreamCall } = setup(
      service({ forwardHeaders: true, headers: [{ key: 'X-Custom', value: '1' }, { key: '', value: 'skip' }] }),
    );

    await proxy.proxyGet('alstyle', 'x', {}, { host: 'softmix.kz', accept: 'application/json', 'content-length': '10' });

    expect(upstreamCall()[1].headers).toEqual({ accept: 'application/json', 'X-Custom': '1' });
  });

  it('без forwardHeaders заголовки клиента не уходят наружу', async () => {
    const { proxy, upstreamCall } = setup(service());
    await proxy.proxyGet('alstyle', 'x', {}, { authorization: 'Bearer наш-токен' });
    expect(upstreamCall()[1].headers).toEqual({});
  });

  it('отключённый сервис — 503', async () => {
    const { proxy } = setup(service({ isActive: false }));
    await expect(proxy.proxyGet('alstyle', 'x', {})).rejects.toMatchObject({ status: HttpStatus.SERVICE_UNAVAILABLE });
  });

  it('неизвестный сервис — 404', async () => {
    const { proxy } = setup(null);
    await expect(proxy.proxyGet('nope', 'x', {})).rejects.toMatchObject({ status: HttpStatus.NOT_FOUND });
  });

  it('ошибка внешнего API передаётся с его статусом', async () => {
    const { proxy, httpService } = setup(service());
    httpService.post.mockReturnValue(throwError(() => ({ response: { status: 422, data: { error: 'bad' } } })));

    const error = await proxy.proxyPost('alstyle', 'items', {}, {}).catch((e) => e);
    expect(error).toBeInstanceOf(HttpException);
    expect(error.getStatus()).toBe(422);
    expect(error.getResponse()).toEqual({ error: 'bad' });
  });

  it('PUT и DELETE тоже проксируются', async () => {
    const { proxy } = setup(service());
    await expect(proxy.proxyPut('alstyle', 'items/1', { a: 1 }, {})).resolves.toEqual({ updated: true });
    await expect(proxy.proxyDelete('alstyle', 'items/1', {})).resolves.toEqual({ deleted: true });
  });
});
