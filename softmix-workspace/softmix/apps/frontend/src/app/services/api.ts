import axios, { AxiosHeaders, InternalAxiosRequestConfig } from 'axios';
import { getCurrentSeconds, isTokenData, UrlPaths } from '@project-lib/shared-types';

import { TOKEN } from '../const';
import { dropToken, dropTokens, getActiveToken, getExpiresIn, saveTokens } from './token';
import { TokenData } from '../types/token';

export const createAPI = (url: string, timeout: number) => {
  const api = axios.create({
    baseURL: url,
    timeout: timeout,
  });

  api.interceptors.request.use(async (config: InternalAxiosRequestConfig) => {
    const expiresIn = getExpiresIn();
    const refreshUrl = `${UrlPaths.Users}/${UrlPaths.Auth}/${UrlPaths.Refresh}`;

    if (config.url === refreshUrl) {
      dropToken(TOKEN);
    }

    let token = getActiveToken();

    if (expiresIn && getCurrentSeconds() > expiresIn && config.url !== refreshUrl) {

      try {
        const {data} = await api.get<TokenData>(refreshUrl);

        if (isTokenData(data)) {
          saveTokens(data.accessToken, data.refreshToken, data.expiresIn);
          token = data.accessToken;
        }
      } catch {
        // Продлить сессию не удалось — дальше работаем как гость.
        dropTokens();
        token = null;
      }
    }

    config.headers = (config.headers ?? {}) as AxiosHeaders;

    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  });

  return api;
};
