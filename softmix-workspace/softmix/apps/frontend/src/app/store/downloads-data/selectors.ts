import { createSelector } from '@reduxjs/toolkit';

import { NameSpace } from '../../const';
import { DownloadsData, State } from '../../types/state';

export const getCategories = createSelector(
  (state: State) => state[NameSpace.Downloads],
  (state: DownloadsData) => state.categories
);

export const getIsCategoriesLoading = createSelector(
  (state: State) => state[NameSpace.Downloads],
  (state: DownloadsData) => state.isCategoriesLoading
);

export const getProducts = createSelector(
  (state: State) => state[NameSpace.Downloads],
  (state: DownloadsData) => state.products
);

export const getIsProductsLoading = createSelector(
  (state: State) => state[NameSpace.Downloads],
  (state: DownloadsData) => state.isProductsLoading
);

export const getNewProducts = createSelector(
  (state: State) => state[NameSpace.Downloads],
  (state: DownloadsData) => state.newProducts
);

export const getExcludedProducts = createSelector(
  (state: State) => state[NameSpace.Downloads],
  (state: DownloadsData) => state.excludedProducts
);

export const getPagination = createSelector(
  (state: State) => state[NameSpace.Downloads],
  (state: DownloadsData) => state.pagination
);
