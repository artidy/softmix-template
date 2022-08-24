import {createAsyncThunk} from "@reduxjs/toolkit";

import {api, store} from "./";
import {errorHandle} from "../services/error-handle";
import {fetchServices} from "./services-slice";
import {ServicesAdapter} from "../adapters/services.adapter";
import {adaptProducts} from "../adapters/products.adapter";
import {fetchCategories, fetchProducts} from "./products-slice";
import {adaptCategories} from "../adapters/categories.adapter";
import {ApiRoutes, AuthorizationStatus, TokenType} from '../const';
import {requireAuthorization} from './user-slice';
import ServiceApi from '../types/service-api';
import ProductApi from '../types/product-api';
import CategoryApi from '../types/category-api';
import {UserLogin, UserAuth} from '../types/user';
import {setAuthorization} from './functions';
import {DataApi} from '../types/data-api';
import {dropTokens, getToken} from '../services/token';

enum APIUserRoute {
  Login = '/login',
  Logout = '/logout',
  CheckAuth = '/check-auth'
}

const fetchServicesAction = createAsyncThunk(
  `data${ApiRoutes.Services}`,
  async () => {
    try {
      const {data} = await api.get<ServiceApi[]>(ApiRoutes.Services);
      store.dispatch(fetchServices(ServicesAdapter(data)));
    } catch (error) {
      errorHandle(error);
    }
  }
);

const fetchProductsAction = createAsyncThunk(
  `data${ApiRoutes.Products}`,
  async () => {
    try {
      const {data} = await api.get<ProductApi[]>(ApiRoutes.Products);
      store.dispatch(fetchProducts(adaptProducts(data)));
    } catch (error) {
      errorHandle(error);
    }
  }
);

const fetchCategoriesAction = createAsyncThunk(
  `data${ApiRoutes.Categories}`,
  async () => {
    try {
      const {data} = await api.get<CategoryApi[]>(ApiRoutes.Categories);
      store.dispatch(fetchCategories(adaptCategories(data)));
    } catch (error) {
      errorHandle(error);
    }
  }
);

const login = createAsyncThunk(
  `data${APIUserRoute.Login}`,
  async (user: UserAuth) => {
    try {
      const {data} = await api.post<DataApi<UserLogin>>(`${ApiRoutes.Users}${APIUserRoute.Login}`, user);
      setAuthorization(data.data, user.isRemember);
    } catch (error) {
      errorHandle(error);
      store.dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
    }
  }
)

const checkUserAuth = createAsyncThunk(
  `data${APIUserRoute.CheckAuth}`,
  async () => {
    try {
      const token = getToken(TokenType.RefreshToken);
      if (!token) {
        store.dispatch(requireAuthorization(AuthorizationStatus.NoAuth));

        return;
      }

      const {data} = await api.get<DataApi<UserLogin>>(`${ApiRoutes.Users}${APIUserRoute.CheckAuth}`);
      setAuthorization(data.data, true);
    } catch (error) {
      store.dispatch(requireAuthorization(AuthorizationStatus.NoAuth));
      dropTokens();
    }
  },
);

export {
  fetchServicesAction,
  fetchProductsAction,
  fetchCategoriesAction,
  login,
  checkUserAuth
};
