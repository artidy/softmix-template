import {createAsyncThunk} from "@reduxjs/toolkit";

import {api, store} from "./";
import {errorHandle} from "../services/error-handle";
import {fetchServices} from "./services-slice";
import {ServicesAdapter} from "../adapters/services.adapter";
import {adaptProducts} from "../adapters/products.adapter";
import {fetchCategories, fetchProducts} from "./products-slice";
import {adaptCategories} from "../adapters/categories.adapter";

const fetchServicesAction = createAsyncThunk(
  'data/services',
  async () => {
    try {
      const {data} = await api.get('/services');
      store.dispatch(fetchServices(ServicesAdapter(data)));
    } catch (error) {
      errorHandle(error);
    }
  }
);

const fetchProductsAction = createAsyncThunk(
  'data/products',
  async () => {
    try {
      const {data} = await api.get('/products');
      store.dispatch(fetchProducts(adaptProducts(data)));
    } catch (error) {
      errorHandle(error);
    }
  }
);

const fetchCategoriesAction = createAsyncThunk(
  'data/products',
  async () => {
    try {
      const {data} = await api.get('/categories');
      store.dispatch(fetchCategories(adaptCategories(data)));
    } catch (error) {
      errorHandle(error);
    }
  }
);

export {fetchServicesAction, fetchProductsAction, fetchCategoriesAction};
