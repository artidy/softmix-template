import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import {
  CategoryApi,
  CategoryCreate,
  CategoryUpdate,
  UrlPaths
} from '@project-lib/shared-types';

import { AsyncThunkConfig } from '../../types/thunk-config';
import { Message, NameSpace } from '../../const';
import {
  addNewCategory,
  deleteCategory,
  setCategoryEdit,
  setCategories,
  setIsCreateMode,
  setIsEditLoading,
  setLoading,
  updateCategory
} from './categories-data';
import { categoriesAdapt, categoryAdapt } from '../../services/adapters/categories.adapter';

export const getCategoriesApi = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Categories}/${UrlPaths.Categories}`,
  async (_arg, { dispatch, extra: { api} }) => {
    try {
      dispatch(setLoading(true));

      const {data} = await api.get<CategoryApi[]>(`${UrlPaths.Categories}`);

      dispatch(setCategories(categoriesAdapt(data)));
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

export const getCategoryApi = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Categories}/${UrlPaths.Categories}/:id`,
  async (id, { dispatch, extra: { api} }) => {
    try {
      dispatch(setIsEditLoading(true));

      const {data} = await api.get<CategoryApi>(`${UrlPaths.Categories}/${id}`);

      dispatch(setCategoryEdit(categoryAdapt(data)));
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

export const createCategoryApi = createAsyncThunk<void, CategoryCreate, AsyncThunkConfig>(
  `${NameSpace.Categories}/${UrlPaths.Categories}`,
  async (elementData, { dispatch, extra: { api } }) => {
    try {
      const { data } = await api.post<CategoryApi>(`${UrlPaths.Categories}`, elementData);

      dispatch(addNewCategory(categoryAdapt(data)));
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

export const updateCategoryApi = createAsyncThunk<void, CategoryUpdate, AsyncThunkConfig>(
  `${NameSpace.Categories}/${UrlPaths.Categories}/:id`,
  async (elementData, { dispatch, extra: { api } }) => {
    try {
      const { data } = await api.patch<CategoryApi>(`${UrlPaths.Categories}/${elementData.id}`, elementData);

      dispatch(updateCategory(categoryAdapt(data)));
      dispatch(setCategoryEdit(null));

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

export const deleteCategoryApi = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Categories}/${UrlPaths.Categories}/:id`,
  async (id, { dispatch, extra: { api } }) => {
    try {
      dispatch(setLoading(true));
      await api.delete<void>(`${UrlPaths.Categories}/${id}`);

      dispatch(deleteCategory(id));

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
