import { createSelector } from '@reduxjs/toolkit';

import { NameSpace } from '../../const';
import { ProductData, State } from '../../types/state';

export const getProducts = createSelector(
  (state: State) => state[NameSpace.Products],
  (state: ProductData) => state.products
);

export const getImages = createSelector(
  (state: State) => state[NameSpace.Products],
  (state: ProductData) => state.images
);

export const getProductsPagination = createSelector(
  (state: State) => state[NameSpace.Products],
  (state: ProductData) => state.pagination
);

export const getIsLoading = createSelector(
  (state: State) => state[NameSpace.Products],
  (state: ProductData) => state.isLoading
);

export const getProductEdit = createSelector(
  (state: State) => state[NameSpace.Products],
  (state: ProductData) => state.productEdit
);

export const getIsEditLoading = createSelector(
  (state: State) => state[NameSpace.Products],
  (state: ProductData) => state.isEditLoading
);

export const getIsCreateMode = createSelector(
  (state: State) => state[NameSpace.Products],
  (state: ProductData) => state.isCreateMode
);
