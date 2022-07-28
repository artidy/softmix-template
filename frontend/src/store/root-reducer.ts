import {combineReducers} from '@reduxjs/toolkit';

import {NameSpace} from "../const";
import {servicesSlice} from "./services-slice";

const rootReducer = combineReducers({
  [NameSpace.Services]: servicesSlice.reducer,
});

export default rootReducer;
