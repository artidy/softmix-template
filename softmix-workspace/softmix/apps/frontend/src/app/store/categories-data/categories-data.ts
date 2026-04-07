import { createSlice } from '@reduxjs/toolkit';

import { CategoriesData } from '../../types/state';
import { NameSpace } from '../../const';

const initialState: CategoriesData = {
  categories: [],
  isLoading: false,
  categoryEdit: null,
  isEditLoading: false,
  isCreateMode: false,
};

export const categoriesData = createSlice({
  name: NameSpace.Categories,
  initialState,
  reducers: {
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    addNewCategory: (state, action) => {
      state.categories.push(action.payload);
    },
    setIsCreateMode: (state, action) => {
      state.isCreateMode = action.payload;
    },
    setCategoryEdit: (state, action) => {
      state.categoryEdit = action.payload;
    },
    setIsEditLoading: (state, action) => {
      state.isEditLoading = action.payload;
    },
    updateCategory: (state, action) => {
      const index = state.categories.findIndex(
        (element) => element.id === action.payload.id
      );
      state.categories[index] = action.payload;
    },
    deleteCategory: (state, action) => {
      const index = state.categories.findIndex(
        (client) => client.id === action.payload
      );
      state.categories = [...state.categories.slice(0, index), ...state.categories.slice(index + 1)];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setCategories,
  addNewCategory,
  setIsCreateMode,
  setCategoryEdit,
  setIsEditLoading,
  updateCategory,
  deleteCategory,
  setLoading,
} = categoriesData.actions;
