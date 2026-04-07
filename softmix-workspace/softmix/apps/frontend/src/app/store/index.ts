import { configureStore } from '@reduxjs/toolkit';

import { rootReducer } from './root-reducer';
import { createAPI } from '../services/api';
import { REQUEST_TIMEOUT } from '../const';
import { environment } from '../../environments/environment';

export const api = createAPI(environment.backendBffUrl, REQUEST_TIMEOUT);

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      thunk: {
        extraArgument: { api }
      },
    }),
});
