import { createSlice } from '@reduxjs/toolkit';

import { ProductData } from '../../types/state';
import { DEFAULT_PAGINATION, NameSpace } from '../../const';

const initialState: ProductData = {
  products: [],
  pagination: DEFAULT_PAGINATION,
  images: [],
  isLoading: false,
  productEdit: null,
  isEditLoading: false,
  isCreateMode: false,
};

export const productsData = createSlice({
  name: NameSpace.Products,
  initialState,
  reducers: {
    setProducts: (state, action) => {
      state.products = action.payload;
    },
    setProductsPagination: (state, action) => {
      state.pagination = action.payload;
    },
    setImages: (state, action) => {
      state.images = action.payload;
    },
    addNewProduct: (state, action) => {
      state.products.push(action.payload);
    },
    addNewImage: (state, action) => {
      const index = state.images.findIndex(
        (element) => element.ownerId === action.payload.ownerId
      );

      if (index >= 0) {
        state.images[index] = action.payload;

        return;
      }

      state.images.push(action.payload);
    },
    setIsCreateMode: (state, action) => {
      state.isCreateMode = action.payload;
    },
    setProductEdit: (state, action) => {
      state.productEdit = action.payload;
    },
    setIsEditLoading: (state, action) => {
      state.isEditLoading = action.payload;
    },
    updateProduct: (state, action) => {
      const index = state.products.findIndex(
        (element) => element.id === action.payload.id
      );
      state.products[index] = action.payload;
    },
    deleteProduct: (state, action) => {
      const index = state.products.findIndex(
        (element) => element.id === action.payload
      );
      state.products = [...state.products.slice(0, index), ...state.products.slice(index + 1)];
    },
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },
  },
});

export const {
  setProducts,
  setProductsPagination,
  setImages,
  addNewProduct,
  addNewImage,
  setIsCreateMode,
  setProductEdit,
  setIsEditLoading,
  updateProduct,
  deleteProduct,
  setLoading,
} = productsData.actions;
