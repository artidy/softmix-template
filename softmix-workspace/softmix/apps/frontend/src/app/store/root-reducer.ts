import { combineReducers } from '@reduxjs/toolkit';

import { NameSpace } from '../const';
import { userData } from './user-data/user-data';
import { categoriesData } from './categories-data/categories-data';
import { productsData } from './products-data/products-data';
import { downloadsData } from './downloads-data/downloads-data';
import { mainData } from './main-data/main-data';
import { cartSlice } from './cart-data/cart-slice';
import { settingsData } from './settings-data/settings-data';

export const rootReducer = combineReducers({
  [NameSpace.Categories]: categoriesData.reducer,
  [NameSpace.Products]: productsData.reducer,
  [NameSpace.Users]: userData.reducer,
  [NameSpace.Downloads]: downloadsData.reducer,
  [NameSpace.Main]: mainData.reducer,
  [NameSpace.Cart]: cartSlice.reducer,
  [NameSpace.Settings]: settingsData.reducer,
});
