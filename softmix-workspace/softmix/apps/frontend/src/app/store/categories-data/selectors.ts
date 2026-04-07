import { createSelector } from '@reduxjs/toolkit';

import { NameSpace } from '../../const';
import { CategoriesData, State } from '../../types/state';

export const getCategories = createSelector(
  (state: State) => state[NameSpace.Categories],
  (state: CategoriesData) => state.categories
);

export const isLoading = createSelector(
  (state: State) => state[NameSpace.Categories],
  (state: CategoriesData) => state.isLoading
);

export const getCategoryEdit = createSelector(
  (state: State) => state[NameSpace.Categories],
  (state: CategoriesData) => state.categoryEdit
);

export const getIsEditLoading = createSelector(
  (state: State) => state[NameSpace.Categories],
  (state: CategoriesData) => state.isEditLoading
);

export const getIsCreateMode = createSelector(
  (state: State) => state[NameSpace.Categories],
  (state: CategoriesData) => state.isCreateMode
);
