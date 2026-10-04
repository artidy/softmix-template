import { createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ProductData } from '../../types/state';
import { NameSpace } from '../../const';
import { FileUrl } from '../../types/upload-file';

// Товары загружает RTK Query (store/shop-api.ts); здесь — фото, которые загрузили сотрудники.
const initialState: ProductData = {
  images: [],
};

export const productsData = createSlice({
  name: NameSpace.Products,
  initialState,
  reducers: {
    setImages: (state, action: PayloadAction<FileUrl[]>) => {
      state.images = action.payload;
    },
    addNewImage: (state, action: PayloadAction<FileUrl>) => {
      const index = state.images.findIndex((element) => element.ownerId === action.payload.ownerId);

      if (index >= 0) {
        state.images[index] = action.payload;
        return;
      }

      state.images.push(action.payload);
    },
  },
});

export const { setImages, addNewImage } = productsData.actions;
