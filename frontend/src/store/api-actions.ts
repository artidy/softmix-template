import {createAsyncThunk} from "@reduxjs/toolkit";

import {api, store} from "./";
import {errorHandle} from "../services/error-handle";
import {fetchServices} from "./services-slice";
import {ServicesAdapter} from "../adapters/services.adapter";

const fetchServicesAction = createAsyncThunk(
  'data/services',
  async () => {
    try {
      const {data} = await api.get('');
      store.dispatch(fetchServices(ServicesAdapter(data.services)));
    } catch (error) {
      errorHandle(error);
    }
  }
);

export {fetchServicesAction};
