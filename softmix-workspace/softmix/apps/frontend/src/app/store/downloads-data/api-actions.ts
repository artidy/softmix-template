import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import {
  AlStyleRoutes,
  CategoryAlStyleApi, DEFAULT_DOWNLOADS_LIMIT,
  ProductsAlStyleWithPaginationApi,
  UrlPaths,
} from '@project-lib/shared-types';

import { AsyncThunkConfig } from '../../types/thunk-config';
import { AppRoute, Message, NameSpace } from '../../const';
import {
  setProducts,
  setIsProductsLoading,
  setIsCategoriesLoading,
  setCategories,
  setPagination
} from './downloads-data';
import { productsAlstyleAdapt } from '../../services/adapters/products-alstyle.adapter';
import { categoriesAlstyleAdapt } from '../../services/adapters/categories-alstyle.adapter';
import { QueryParams } from '../../types/product';
import { paginationAdapt } from '../../services/adapters/pagination.adapter';

export const getServiceCategoriesApi = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Downloads}/service/categories`,
  async (serviceName, { dispatch, extra: { api } }) => {
    try {
      dispatch(setIsCategoriesLoading(true));

      const { data } = await api.get<CategoryAlStyleApi[]>(
        `${UrlPaths.ServiceProxy}/${serviceName}/categories`,
        { timeout: 15000 }
      );

      dispatch(setCategories(categoriesAlstyleAdapt(data)));
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data?.message || message;
      }
      toast.error(message);
    }

    dispatch(setIsCategoriesLoading(false));
  }
);

export const getServiceProductsApi = createAsyncThunk<void, { serviceName: string } & QueryParams, AsyncThunkConfig>(
  `${NameSpace.Downloads}/service/products`,
  async ({ serviceName, ...queryParams }, { dispatch, extra: { api } }) => {
    try {
      dispatch(setIsProductsLoading(true));

      const offset = (queryParams.page - 1) * DEFAULT_DOWNLOADS_LIMIT;

      const { data } = await api.get<ProductsAlStyleWithPaginationApi>(
        `${UrlPaths.ServiceProxy}/${serviceName}/elements-pagination`,
        {
          timeout: 15000,
          params: {
            category: queryParams.categoryId,
            limit: DEFAULT_DOWNLOADS_LIMIT,
            offset,
            additional_fields: 'images',
          },
        }
      );

      dispatch(setProducts(productsAlstyleAdapt(data.elements)));
      dispatch(setPagination(
        paginationAdapt(AppRoute.Import, queryParams, data.pagination.totalCount, data.elements.length)
      ));
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data?.message || message;
      }
      toast.error(message);
    }

    dispatch(setIsProductsLoading(false));
  }
);

/** @deprecated Используйте getServiceCategoriesApi */
export const getAlstyleCategoriesApi = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Downloads}${AlStyleRoutes.AlStyle}${AlStyleRoutes.Categories}`,
  async (_arg, { dispatch, extra: { api} }) => {
    try {
      dispatch(setIsCategoriesLoading(true));

      const {data} = await api.get<CategoryAlStyleApi[]>(`${AlStyleRoutes.AlStyle}${AlStyleRoutes.Categories}`,
        { timeout: 15000 });

      dispatch(setCategories(categoriesAlstyleAdapt(data)));
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }

    dispatch(setIsCategoriesLoading(false));
  }
);

/** @deprecated Используйте getServiceProductsApi */
export const getAlstyleProductsApi = createAsyncThunk<void, QueryParams, AsyncThunkConfig>(
  `${NameSpace.Downloads}${AlStyleRoutes.AlStyle}${AlStyleRoutes.Products}`,
  async (queryParams, { dispatch, extra: { api} }) => {
    try {
      dispatch(setIsProductsLoading(true));

      const offset = (queryParams.page - 1) * DEFAULT_DOWNLOADS_LIMIT;

      const {data} = await api.get<ProductsAlStyleWithPaginationApi>(
        `${AlStyleRoutes.AlStyle}${AlStyleRoutes.Products}/${queryParams.categoryId}`,
        {
          timeout: 15000,
          params: {
            limit: DEFAULT_DOWNLOADS_LIMIT,
            offset: offset,
          }
        });

      dispatch(setProducts(productsAlstyleAdapt(data.elements)));
      dispatch(setPagination(
        paginationAdapt(AppRoute.Downloads, queryParams, data.pagination.totalCount, data.elements.length)));
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }

    dispatch(setIsProductsLoading(false));
  }
);
