import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { ProductApi, ProductsPaginationApi, UrlPaths } from '@project-lib/shared-types';

import { AsyncThunkConfig } from '../../types/thunk-config';
import { Message, NameSpace } from '../../const';
import { setNewProducts, setIsNewProductsLoading, setHotProducts, setIsHotProductsLoading } from './main-data';
import { productsAdapt } from '../../services/adapters/products.adapter';

export const getNewProductsApi = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Main}/${UrlPaths.Products}`,
  async (_arg, { dispatch, extra: { api} }) => {
    try {
      dispatch(setIsNewProductsLoading(true));

      const {data} = await api.get<ProductsPaginationApi>(`${UrlPaths.Products}?limit=8&is_new=true&page=1`);

      dispatch(setNewProducts(productsAdapt(data.products)));
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }

    dispatch(setIsNewProductsLoading(false));
  }
);

export const getHotProductsApi = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Main}/${UrlPaths.Products}`,
  async (_arg, { dispatch, extra: { api} }) => {
    try {
      dispatch(setIsHotProductsLoading(true));

      const {data} = await api.get<ProductsPaginationApi>(`${UrlPaths.Products}?limit=8&is_hot=true&page=1`);

      dispatch(setHotProducts(productsAdapt(data.products)));
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }

    dispatch(setIsHotProductsLoading(false));
  }
);
