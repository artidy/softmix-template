import {combineReducers} from '@reduxjs/toolkit';

import {NameSpace} from "../const";
import {servicesSlice} from "./services-slice";
import {productsSlice} from "./products-slice";
import {userSlice} from './user-slice';

const rootReducer = combineReducers({
  [NameSpace.Services]: servicesSlice.reducer,
  [NameSpace.Products]: productsSlice.reducer,
  [NameSpace.User]: userSlice.reducer
});

export default rootReducer;
