import { createSelector } from '@reduxjs/toolkit';

import { NameSpace } from '../../const';
import { MainData, State } from '../../types/state';

export const getNewProducts = createSelector(
  (state: State) => state[NameSpace.Main],
  (state: MainData) => state.newProducts
);

export const getIsNewProductsLoading = createSelector(
  (state: State) => state[NameSpace.Main],
  (state: MainData) => state.isNewProductsLoading
);

export const getHotProducts = createSelector(
  (state: State) => state[NameSpace.Main],
  (state: MainData) => state.hotProducts
);

export const getIsHotProductsLoading = createSelector(
  (state: State) => state[NameSpace.Main],
  (state: MainData) => state.isHotProductsLoading
);
