import { createSlice } from '@reduxjs/toolkit';

import { MainData } from '../../types/state';
import { NameSpace } from '../../const';

const initialState: MainData = {
  newProducts: [],
  hotProducts: [],
  isNewProductsLoading: false,
  isHotProductsLoading: false,
};

export const mainData = createSlice({
  name: NameSpace.Products,
  initialState,
  reducers: {
    setNewProducts: (state, action) => {
      state.newProducts = action.payload;
    },
    setIsNewProductsLoading: (state, action) => {
      state.isNewProductsLoading = action.payload;
    },
    setHotProducts: (state, action) => {
      state.hotProducts = action.payload;
    },
    setIsHotProductsLoading: (state, action) => {
      state.isHotProductsLoading = action.payload;
    },
  },
});

export const {
  setNewProducts,
  setIsNewProductsLoading,
  setHotProducts,
  setIsHotProductsLoading,
} = mainData.actions;
