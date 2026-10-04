import { BaseQueryFn, createApi } from '@reduxjs/toolkit/query/react';
import { AxiosError, AxiosRequestConfig } from 'axios';
import { FileApi, ProductApi, ProductsPaginationApi, UrlPaths } from '@project-lib/shared-types';

import { http } from '../services/http';
import { getImageUrl, getQueryString } from '../services/helpers';
import { productAdapt, productsAdapt } from '../services/adapters/products.adapter';
import { fileAdapt } from '../services/adapters/file.adapter';
import { addNewImage } from './products-data/products-data';
import { Product, QueryParams } from '../types/product';
import { FileUrl } from '../types/upload-file';
import { DEFAULT_PRODUCT_IMG } from '../const';

export type ApiError = {
  status?: number;
  message: string;
};

type AxiosQuery = {
  url: string;
  method?: AxiosRequestConfig['method'];
  data?: unknown;
  params?: AxiosRequestConfig['params'];
};

export type ProductsPage = {
  products: Product[];
  total: number;
};

// Запросы идут через тот же axios-клиент, что и старые thunk'и: с токеном и его обновлением.
const axiosBaseQuery =
  (): BaseQueryFn<AxiosQuery, unknown, ApiError> =>
  async ({ url, method = 'GET', data, params }) => {
    try {
      const response = await http.request({ url, method, data, params });
      return { data: response.data };
    } catch (e) {
      const error = e as AxiosError<{ message?: string }>;
      return {
        error: {
          status: error.response?.status,
          message: error.response?.data?.message ?? error.message,
        },
      };
    }
  };

export const shopApi = createApi({
  reducerPath: 'shopApi',
  baseQuery: axiosBaseQuery(),
  // Thunk'и, которые меняют товары, сбрасывают этот тег — списки перезапрашиваются сами.
  tagTypes: ['Product'],
  endpoints: (build) => ({
    getCatalogTotal: build.query<number, void>({
      query: () => ({ url: UrlPaths.Products, params: { limit: 1 } }),
      transformResponse: (response: ProductsPaginationApi) => response.total,
      providesTags: ['Product'],
    }),
    getProducts: build.query<ProductsPage, QueryParams>({
      // Свой сериализатор: повторяющийся categoryIds=…&categoryIds=… бэкенд уже понимает.
      query: (params) => ({ url: `${UrlPaths.Products}${getQueryString(params)}` }),
      transformResponse: (response: ProductsPaginationApi) => ({
        products: productsAdapt(response.products),
        total: response.total,
      }),
      providesTags: ['Product'],
    }),
    getProduct: build.query<Product, string>({
      async queryFn(id, { dispatch }, _extraOptions, baseQuery) {
        const result = await baseQuery({ url: `${UrlPaths.Products}/${id}` });
        if (result.error) {
          return { error: result.error as ApiError };
        }

        const product = result.data as ProductApi | null;
        if (!product?.id) {
          return { error: { status: 404, message: 'Товар не найден' } };
        }

        // Загруженное сотрудником фото важнее картинки поставщика — как и в каталоге.
        const image = await baseQuery({ url: `${UrlPaths.Uploader}/${UrlPaths.Products}/${id}` });
        const file = image.data as FileApi | null | undefined;
        if (file?.url) {
          dispatch(addNewImage(fileAdapt(file)));
        }

        return { data: productAdapt(product) };
      },
      providesTags: (_result, _error, id) => [{ type: 'Product', id }],
    }),
    /**
     * Витрина на главной: по одному свежему товару с фото из каждого направления,
     * чтобы там были разные категории, а не четыре последних загруженных МФУ.
     * Аргумент — списки id категорий: направление вместе с подкатегориями.
     */
    getShowcase: build.query<Product[], string[][]>({
      async queryFn(groups, { getState }, _extraOptions, baseQuery) {
        const images = (getState() as { PRODUCTS: { images: FileUrl[] } }).PRODUCTS.images;
        const hasPhoto = (product: Product) => getImageUrl(images, product.id, product.imageUrl) !== DEFAULT_PRODUCT_IMG;

        const results = await Promise.all(
          groups.map((categoryIds) =>
            baseQuery({ url: `${UrlPaths.Products}${getQueryString({ limit: 6, page: 1, sortBy: 'newest', categoryIds })}` }),
          ),
        );

        const picked: Product[] = [];
        for (const result of results) {
          // Ошибка в одном направлении не ломает витрину — просто пропускаем его.
          if (result.error || !result.data) {
            continue;
          }
          const product = productsAdapt((result.data as ProductsPaginationApi).products).find(hasPhoto);
          if (product) {
            picked.push(product);
          }
        }
        return { data: picked };
      },
      providesTags: ['Product'],
    }),
  }),
});

export const { useGetCatalogTotalQuery, useGetProductsQuery, useGetProductQuery, useGetShowcaseQuery } = shopApi;
