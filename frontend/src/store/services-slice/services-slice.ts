import {createSlice} from "@reduxjs/toolkit";

import {NameSpace} from "../../const";
import Service from "../../types/service";

const INITIAL_SERVICES: Service[] = [];

const initialState = {
  services: INITIAL_SERVICES,
  servicesLoaded: false
}

const servicesSlice = createSlice({
    name: NameSpace.Services,
    initialState,
    reducers: {
      fetchServices: (state, action) => {
        state.services = action.payload;
        state.servicesLoaded = true;
      }
    }
  }
);

const {fetchServices} = servicesSlice.actions;

export {servicesSlice, fetchServices};
