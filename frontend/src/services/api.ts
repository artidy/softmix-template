import axios, {AxiosInstance, AxiosRequestConfig} from "axios";

import {getToken} from "./token";

const BACKEND_URL = 'http://localhost:4000/';
const REQUEST_TIMEOUT = 5000;
const HEADERS_FIELD_TOKEN = 'x-token';

const createApi = (): AxiosInstance => {
  const api = axios.create({
    baseURL: BACKEND_URL,
    timeout: REQUEST_TIMEOUT,
    headers: {}
  });

  api.interceptors.request.use((config: AxiosRequestConfig) => {
    const token = getToken();

    if (token) {
      config.headers[HEADERS_FIELD_TOKEN] = token;
    }

    return config;
  })

  return api;
};

export default createApi;
