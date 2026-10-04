import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { CategoryApi, CategoryCreate, CategoryUpdate, UrlPaths } from '@project-lib/shared-types';

import { AsyncThunkConfig } from '../../types/thunk-config';
import { Message, NameSpace } from '../../const';
import { addNewCategory, deleteCategory, setCategories, setLoading, updateCategory } from './categories-data';
import { categoriesAdapt, categoryAdapt } from '../../services/adapters/categories.adapter';

function getErrorMessage(e: unknown): string {
  if (isAxiosError(e)) {
    return e.response?.data?.message ?? Message.UnknownMessage;
  }
  return Message.UnknownMessage;
}

export const getCategoriesApi = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Categories}/getCategories`,
  async (_arg, { dispatch, extra: { api } }) => {
    try {
      dispatch(setLoading(true));

      const { data } = await api.get<CategoryApi[]>(UrlPaths.Categories);

      dispatch(setCategories(categoriesAdapt(data)));
    } catch (e) {
      toast.error(getErrorMessage(e));
    } finally {
      dispatch(setLoading(false));
    }
  },
);

/** Возвращает true, если категория создана. */
export const createCategoryApi = createAsyncThunk<boolean, CategoryCreate, AsyncThunkConfig>(
  `${NameSpace.Categories}/createCategory`,
  async (elementData, { dispatch, extra: { api } }) => {
    try {
      const { data } = await api.post<CategoryApi>(UrlPaths.Categories, elementData);

      dispatch(addNewCategory(categoryAdapt(data)));
      toast.success(Message.AddNewElement);
      return true;
    } catch (e) {
      toast.error(getErrorMessage(e));
      return false;
    }
  },
);

/** Возвращает true, если изменения сохранены. */
export const updateCategoryApi = createAsyncThunk<boolean, CategoryUpdate, AsyncThunkConfig>(
  `${NameSpace.Categories}/updateCategory`,
  async (elementData, { dispatch, extra: { api } }) => {
    try {
      const { data } = await api.patch<CategoryApi>(`${UrlPaths.Categories}/${elementData.id}`, elementData);

      dispatch(updateCategory(categoryAdapt(data)));
      toast.success(Message.UpdateElement);
      return true;
    } catch (e) {
      toast.error(getErrorMessage(e));
      return false;
    }
  },
);

/** Возвращает true, если категория удалена. */
export const deleteCategoryApi = createAsyncThunk<boolean, string, AsyncThunkConfig>(
  `${NameSpace.Categories}/deleteCategory`,
  async (id, { dispatch, extra: { api } }) => {
    try {
      await api.delete<void>(`${UrlPaths.Categories}/${id}`);

      dispatch(deleteCategory(id));
      toast.success(Message.DeleteElement);
      return true;
    } catch (e) {
      toast.error(getErrorMessage(e));
      return false;
    }
  },
);
