import {combineReducers} from '@reduxjs/toolkit';

import {NameSpace} from "../const";
import {servicesSlice} from "./services-slice";
import {productsSlice} from "./products-slice";

const rootReducer = combineReducers({
  [NameSpace.Services]: servicesSlice.reducer,
  [NameSpace.Products]: productsSlice.reducer
});

export default rootReducer;
