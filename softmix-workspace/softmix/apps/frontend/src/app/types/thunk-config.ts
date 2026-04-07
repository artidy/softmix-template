import { AxiosInstance } from 'axios';

import { AppDispatch, State } from './state';

export type ApiInstance = {
  api: AxiosInstance;
  apiReport: AxiosInstance;
}

export type AsyncThunkConfig = {
  dispatch: AppDispatch;
  state: State;
  extra: ApiInstance;
};
