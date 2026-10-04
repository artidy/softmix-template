import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { CategoriesData } from '../../types/state';
import { NameSpace } from '../../const';
import { Category } from '../../types/category';

const initialState: CategoriesData = {
  categories: [],
  isLoading: false,
};

export const categoriesData = createSlice({
  name: NameSpace.Categories,
  initialState,
  reducers: {
    setCategories: (state, action: PayloadAction<Category[]>) => {
      state.categories = action.payload;
    },
    addNewCategory: (state, action: PayloadAction<Category>) => {
      state.categories.push(action.payload);
    },
    updateCategory: (state, action: PayloadAction<Category>) => {
      const index = state.categories.findIndex((element) => element.id === action.payload.id);
      if (index >= 0) {
        state.categories[index] = action.payload;
      }
    },
    deleteCategory: (state, action: PayloadAction<string>) => {
      state.categories = state.categories.filter((element) => element.id !== action.payload);
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setCategories, addNewCategory, updateCategory, deleteCategory, setLoading } = categoriesData.actions;
