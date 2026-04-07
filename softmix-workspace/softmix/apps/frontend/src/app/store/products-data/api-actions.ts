import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import {
  FileApi,
  ProductApi,
  ProductCreate, ProductsPaginationApi,
  ProductUpdate,
  UrlPaths
} from '@project-lib/shared-types';

import { AsyncThunkConfig } from '../../types/thunk-config';
import { AppRoute, Message, NameSpace, UPLOADER_URL } from '../../const';
import {
  setProducts,
  setProductsPagination,
  addNewProduct,
  deleteProduct,
  setProductEdit,
  setIsCreateMode,
  setIsEditLoading,
  setLoading,
  updateProduct, addNewImage, setImages,
} from './products-data';
import { productAdapt, productsAdapt } from '../../services/adapters/products.adapter';
import { addExcludedProduct, setNewProducts } from '../downloads-data/downloads-data';
import { QueryParams } from '../../types/product';
import { getQueryString } from '../../services/helpers';
import { paginationAdapt } from '../../services/adapters/pagination.adapter';
import { UploadFile } from '../../types/upload-file';
import { fileAdapt, filesAdapt } from '../../services/adapters/file.adapter';

export const getProductsApi = createAsyncThunk<void, QueryParams, AsyncThunkConfig>(
  `${NameSpace.Products}/${UrlPaths.Products}`,
  async (queryParams, { dispatch, extra: { api} }) => {
    try {
      dispatch(setLoading(true));

      const {data} = await api.get<ProductsPaginationApi>(`${UrlPaths.Products}${getQueryString(queryParams)}`);
      const count = data.products.length;

      dispatch(setProducts(productsAdapt(data.products)));
      dispatch(setProductsPagination(paginationAdapt(AppRoute.Shop, queryParams, data.total, count)));
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }

    dispatch(setLoading(false));
  }
);

export const getProductApi = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Products}/${UrlPaths.Products}/:id`,
  async (id, { dispatch, extra: { api} }) => {
    try {
      dispatch(setIsEditLoading(true));

      const {data} = await api.get<ProductApi>(`${UrlPaths.Products}/${id}`);

      if (data.imageUrl === '') {
        const { data: ownerImage } = await api.get<FileApi>(`${UrlPaths.Uploader}/${UrlPaths.Products}/${id}`);
        data.imageUrl = ownerImage.url;
      }
      
      dispatch(setProductEdit(productAdapt(data)));
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    } finally {
      dispatch(setIsEditLoading(false));
    }
  }
);

export const createProductApi = createAsyncThunk<void, ProductCreate, AsyncThunkConfig>(
  `${NameSpace.Products}/${UrlPaths.Products}`,
  async (element, { dispatch, extra: { api } }) => {
    try {
      const { data } = await api.post<ProductApi>(`${UrlPaths.Products}`, element);

      dispatch(addNewProduct(productAdapt(data)));
      dispatch(setIsCreateMode(false));

      toast.success(Message.AddNewElement);
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }
  }
);

export const createProductManyApi = createAsyncThunk<void, ProductCreate[], AsyncThunkConfig>(
  `${NameSpace.Products}/${UrlPaths.Products}`,
  async (element, { dispatch, extra: { api } }) => {
    try {
      const {data} = await api.post<ProductApi[]>(`${UrlPaths.Products}/many`, element);

      dispatch(setNewProducts([]));

      for (const product of data) {
        dispatch(addExcludedProduct(product.id));
      }

      toast.success(Message.AddNewElement);
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }
  }
);

export const updateProductApi = createAsyncThunk<void, ProductUpdate, AsyncThunkConfig>(
  `${NameSpace.Products}/${UrlPaths.Products}/:id`,
  async (element, { dispatch, extra: { api } }) => {
    try {
      const { data } = await api.patch<ProductApi>(`${UrlPaths.Products}/${element.id}`, element);

      dispatch(updateProduct(productAdapt(data)));
      dispatch(setProductEdit(null));

      toast.success(Message.UpdateElement);
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }
  }
);

export const deleteProductApi = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Products}/${UrlPaths.Products}/:id`,
  async (id, { dispatch, extra: { api } }) => {
    try {
      dispatch(setLoading(true));
      await api.delete<void>(`${UrlPaths.Products}/${id}`);

      dispatch(deleteProduct(id));

      toast.success(Message.DeleteElement);
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }

    dispatch(setLoading(false));
  }
);

export const getImagesApi = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Products}/${UrlPaths.Uploader}`,
  async (_arg, { dispatch, extra: { api } }) => {
    try {
      const {data} = await api.get<FileApi[]>(`${UrlPaths.Uploader}/${UrlPaths.Products}`
      );
      dispatch(setImages(filesAdapt(data)));
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }
  }
);

export const uploadImage = createAsyncThunk<void, UploadFile, AsyncThunkConfig>(
  `${NameSpace.Products}/${UrlPaths.Uploader}`,
  async (uploadFile, { dispatch, extra: { api } }) => {
    const formData = new FormData();
    formData.append('ownerId', uploadFile.ownerId);
    formData.append('file', uploadFile.file);

    try {
      const {data} = await api.post<FileApi>(
        `${UrlPaths.Uploader}/${UrlPaths.Products}/${uploadFile.ownerId}`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data',  timeout: 600000 }}
      );
      dispatch(addNewImage(fileAdapt(data)));
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }
  }
);
