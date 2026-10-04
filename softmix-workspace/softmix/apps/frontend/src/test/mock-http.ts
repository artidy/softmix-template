import { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';

import { http } from '../app/services/http';

type Reply = unknown | ((config: InternalAxiosRequestConfig) => unknown);

export type MockRoute = {
  method?: 'get' | 'post' | 'put' | 'patch' | 'delete';
  /** Путь без /api и без строки запроса, например 'products' или /^products\/.+/. */
  url: string | RegExp;
  reply?: Reply;
  status?: number;
};

export type MockedCall = {
  method: string;
  path: string;
  params: URLSearchParams;
  data: unknown;
};

function splitUrl(url = ''): { path: string; params: URLSearchParams } {
  const [path, query = ''] = url.replace(/^\//, '').split('?');
  return { path, params: new URLSearchParams(query) };
}

/**
 * Подменяет сетевой слой общего axios-клиента: запросы не уходят в сеть,
 * а получают ответы из списка. Неописанный запрос отвечает 404 — так тест сразу видит лишние вызовы.
 */
export function mockHttp(routes: MockRoute[] = []) {
  const calls: MockedCall[] = [];

  http.defaults.adapter = async (config) => {
    const method = (config.method ?? 'get').toLowerCase();
    const { path, params } = splitUrl(config.url);
    for (const [key, value] of Object.entries(config.params ?? {})) {
      params.set(key, String(value));
    }
    const data = typeof config.data === 'string' ? safeJson(config.data) : config.data;
    calls.push({ method, path, params, data });

    const route = routes.find(
      (item) => (item.method ?? 'get') === method && (typeof item.url === 'string' ? item.url === path : item.url.test(path)),
    );
    const status = route ? route.status ?? 200 : 404;
    const body = route
      ? typeof route.reply === 'function'
        ? await (route.reply as (config: InternalAxiosRequestConfig) => unknown)(config)
        : route.reply
      : { message: `Нет мока для ${method.toUpperCase()} ${path}` };

    const response: AxiosResponse = { data: body, status, statusText: String(status), headers: {}, config };
    if (status >= 400) {
      throw new AxiosError(`Request failed with status code ${status}`, 'ERR_BAD_REQUEST', config, null, response);
    }
    return response;
  };

  return { calls };
}

function safeJson(value: string): unknown {
  try {
    return JSON.parse(value);
  } catch {
    return value;
  }
}
