import { createSlice } from '@reduxjs/toolkit';

import { DownloadsData } from '../../types/state';
import { DEFAULT_PAGINATION, NameSpace } from '../../const';

const initialState: DownloadsData = {
  categories: [],
  products: [],
  excludedProducts: [],
  newProducts: [],
  pagination: DEFAULT_PAGINATION,
  isCategoriesLoading: false,
  isProductsLoading: false,
};

export const downloadsData = createSlice({
  name: NameSpace.Downloads,
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setCategories: (state, action) => {
      state.categories = action.payload;
    },
    setExcludedProducts: (state, action) => {
      state.excludedProducts = action.payload;
    },
    addExcludedProduct: (state, action) => {
      state.excludedProducts.push(action.payload);
    },
    setNewProducts: (state, action) => {
      state.newProducts = action.payload;
    },
    addNewProduct: (state, action) => {
      state.newProducts.push(action.payload);
    },
    deleteNewProduct: (state, action) => {
      const index = state.newProducts.findIndex(
        (element) => element.id === action.payload
      );
      state.newProducts = [...state.newProducts.slice(0, index), ...state.newProducts.slice(index + 1)];
    },
    setPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setIsCategoriesLoading: (state, action) => {
      state.isCategoriesLoading = action.payload;
    },
    setIsProductsLoading: (state, action) => {
      state.isProductsLoading = action.payload;
    },
  },
});

export const {
  setCategories,
  setProducts,
  setIsProductsLoading,
  setIsCategoriesLoading,
  setExcludedProducts,
  addExcludedProduct,
  setNewProducts,
  addNewProduct,
  deleteNewProduct,
  setPagination,
} = downloadsData.actions;
