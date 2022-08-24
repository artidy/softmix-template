import axios, {AxiosInstance, AxiosRequestConfig, AxiosResponse} from "axios";

import {getToken, saveTokens} from "./token";
import {TokenType} from '../const';

enum ApiTokenTypes {
  Token = 'x-token',
  RefreshToken = 'x-refresh-token'
}

const BACKEND_URL = 'http://localhost:4000/';
const REQUEST_TIMEOUT = 5000;

const createApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {}
  });

  api.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = getToken(TokenType.Token);
    const refreshToken = getToken(TokenType.RefreshToken);

    if (token && refreshToken) {
      config.headers[ApiTokenTypes.Token] = token;
      config.headers[ApiTokenTypes.RefreshToken] = refreshToken;
    }

    return config;
  })

  api.interceptors.response.use((res: AxiosResponse) => {
    const {data} = res;
    const refreshToken = getToken(TokenType.RefreshToken)

    if (data.newTokens && refreshToken) {
      saveTokens(data.newTokens);
    }

    return res;
  })

  return api;
};

export default createApi;
