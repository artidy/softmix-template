import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { FileApi, ProductApi, ProductCreate, ProductUpdate, UrlPaths } from '@project-lib/shared-types';

import { AsyncThunkConfig } from '../../types/thunk-config';
import { Message, NameSpace } from '../../const';
import { addNewImage, setImages } from './products-data';
import { addExcludedProduct, setNewProducts } from '../downloads-data/downloads-data';
import { UploadFile } from '../../types/upload-file';
import { fileAdapt, filesAdapt } from '../../services/adapters/file.adapter';
import { shopApi } from '../shop-api';

function getErrorMessage(e: unknown): string {
  if (isAxiosError(e)) {
    return e.response?.data?.message ?? Message.UnknownMessage;
  }
  return Message.UnknownMessage;
}

// Товары живут в кэше RTK Query: после изменений просим списки и карточки обновиться.
const refreshProductLists = () => shopApi.util.invalidateTags(['Product']);

/** Возвращает true, если товар создан. */
export const createProductApi = createAsyncThunk<boolean, ProductCreate, AsyncThunkConfig>(
  `${NameSpace.Products}/createProduct`,
  async (element, { dispatch, extra: { api } }) => {
    try {
      await api.post<ProductApi>(UrlPaths.Products, element);

      dispatch(refreshProductLists());
      toast.success(Message.AddNewElement);
      return true;
    } catch (e) {
      toast.error(getErrorMessage(e));
      return false;
    }
  },
);

export const createProductManyApi = createAsyncThunk<void, ProductCreate[], AsyncThunkConfig>(
  `${NameSpace.Products}/createProductMany`,
  async (element, { dispatch, extra: { api } }) => {
    try {
      const { data } = await api.post<ProductApi[]>(`${UrlPaths.Products}/many`, element);

      dispatch(setNewProducts([]));

      for (const product of data) {
        dispatch(addExcludedProduct(product.id));
      }

      dispatch(refreshProductLists());
      toast.success(Message.AddNewElement);
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  },
);

/** Возвращает true, если изменения сохранены. */
export const updateProductApi = createAsyncThunk<boolean, ProductUpdate, AsyncThunkConfig>(
  `${NameSpace.Products}/updateProduct`,
  async (element, { dispatch, extra: { api } }) => {
    try {
      await api.patch<ProductApi>(`${UrlPaths.Products}/${element.id}`, element);

      dispatch(refreshProductLists());
      toast.success(Message.UpdateElement);
      return true;
    } catch (e) {
      toast.error(getErrorMessage(e));
      return false;
    }
  },
);

/** Возвращает true, если товар удалён. */
export const deleteProductApi = createAsyncThunk<boolean, string, AsyncThunkConfig>(
  `${NameSpace.Products}/deleteProduct`,
  async (id, { dispatch, extra: { api } }) => {
    try {
      await api.delete<void>(`${UrlPaths.Products}/${id}`);

      dispatch(refreshProductLists());
      toast.success(Message.DeleteElement);
      return true;
    } catch (e) {
      toast.error(getErrorMessage(e));
      return false;
    }
  },
);

export const getImagesApi = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Products}/getImages`,
  async (_arg, { dispatch, extra: { api } }) => {
    try {
      const { data } = await api.get<FileApi[]>(`${UrlPaths.Uploader}/${UrlPaths.Products}`);
      dispatch(setImages(filesAdapt(data)));
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  },
);

export const uploadImage = createAsyncThunk<void, UploadFile, AsyncThunkConfig>(
  `${NameSpace.Products}/uploadImage`,
  async (uploadFile, { dispatch, extra: { api } }) => {
    const formData = new FormData();
    formData.append('ownerId', uploadFile.ownerId);
    formData.append('file', uploadFile.file);

    try {
      const { data } = await api.post<FileApi>(`${UrlPaths.Uploader}/${UrlPaths.Products}/${uploadFile.ownerId}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
        // Большие фото грузятся дольше обычного таймаута запросов.
        timeout: 600000,
      });
      dispatch(addNewImage(fileAdapt(data)));
      toast.success('Фото загружено');
    } catch (e) {
      toast.error(getErrorMessage(e));
    }
  },
);
