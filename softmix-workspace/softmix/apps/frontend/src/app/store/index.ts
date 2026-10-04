import { configureStore } from '@reduxjs/toolkit';
import { AxiosInstance } from 'axios';

import { rootReducer } from './root-reducer';
import { shopApi } from './shop-api';
import { http } from '../services/http';

// Старые страницы ещё берут клиент отсюда; новый код импортирует его из services/http.
export const api = http;

export type RootState = ReturnType<typeof rootReducer>;

/** Отдельная функция, чтобы тесты создавали чистый стор на каждый случай. */
export function setupStore(preloadedState?: Partial<RootState>, client: AxiosInstance = http) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        thunk: {
          extraArgument: { api: client },
        },
      }).concat(shopApi.middleware),
  });
}

export const store = setupStore();

export type AppStore = ReturnType<typeof setupStore>;
