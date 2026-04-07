import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { UrlPaths } from '@project-lib/shared-types';

import { AsyncThunkConfig } from '../../types/thunk-config';
import { Message, NameSpace } from '../../const';
import { AuthorizationStatus, CreateUser, LoginUser, UpdateUser, UserApi } from '../../types/user';
import {
  addUser,
  deleteUser, logout,
  setAuthorizationStatus, setCreateMode,
  setEditUserLoading,
  setUser,
  setUserEdit,
  setUsers,
  setUsersLoading, updateUser
} from './user-data';
import { dropTokens, getActiveToken, saveTokens } from '../../services/token';
import { userAdapt, usersAdapt } from '../../services/adapters/user.adapter';
import { TokenData } from '../../types/token';

export const verify = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Users}/${UrlPaths.Users}/${UrlPaths.Auth}/${UrlPaths.Verify}`,
  async (_arg, { dispatch, extra: { api } }) => {
    try {
      const token = getActiveToken();

      if (!token) {
        dispatch(setUser(userAdapt(null)));
        dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));

        return;
      }

      const { data } = await api.get<UserApi>(`${UrlPaths.Users}/${UrlPaths.Auth}/${UrlPaths.Verify}`);

      dispatch(setUser(userAdapt(data)));
      dispatch(setAuthorizationStatus(AuthorizationStatus.Auth));
    } catch(e) {
      dispatch(setUser(userAdapt(null)));
      dispatch(setAuthorizationStatus(AuthorizationStatus.NoAuth));
    }
  }
);

export const login = createAsyncThunk<void, LoginUser, AsyncThunkConfig>(
  `${NameSpace.Users}/${UrlPaths.Login}`,
  async (authData, { dispatch, extra: { api } }) => {
    try {
      const {data} = await api.post<TokenData>(`${UrlPaths.Auth}/${UrlPaths.Login}`, authData);
      saveTokens(data.accessToken, data.refreshToken, data.expiresIn);
      dispatch(verify());
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }
  }
);

export const register = createAsyncThunk<void, CreateUser, AsyncThunkConfig>(
  `${NameSpace.Users}/${UrlPaths.Register}/public`,
  async (userData, { dispatch, extra: { api } }) => {
    try {
      const {data} = await api.post<UserApi>(`${UrlPaths.Auth}/${UrlPaths.Register}`, userData);

      // Auto login after successful registration
      const loginData: LoginUser = {
        login: userData.login,
        password: userData.password
      };

      const {data: tokenData} = await api.post<TokenData>(`${UrlPaths.Auth}/${UrlPaths.Login}`, loginData);
      saveTokens(tokenData.accessToken, tokenData.refreshToken, tokenData.expiresIn);
      dispatch(verify());

      toast.success('Регистрация успешна! Добро пожаловать!');
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }
  }
);

export const addUserApi = createAsyncThunk<void, CreateUser, AsyncThunkConfig>(
  `${NameSpace.Users}/${UrlPaths.Register}`,
  async (userData, { dispatch, extra: { api } }) => {

    try {
      const {data} = await api.post<UserApi>(`${UrlPaths.Users}/${UrlPaths.Register}`, userData);

      dispatch(addUser(userAdapt(data)));
      dispatch(setCreateMode(false));

      toast.success(Message.AddNewElement);
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }
  }
);

export const updateUserApi = createAsyncThunk<void, UpdateUser, AsyncThunkConfig>(
  `${NameSpace.Users}/${UrlPaths.Users}`,
  async (userData, { dispatch, extra: { api } }) => {

    try {
      const {data} = await api.patch<UserApi>(`${UrlPaths.Users}/${userData.id}`, userData);
      dispatch(updateUser(userAdapt(data)));
      dispatch(setUserEdit(null));

      toast.success(Message.UpdateElement);
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }

      toast.error(message);
    }
  }
);

export const getApiUsers = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Users}/${UrlPaths.Users}`,
  async (_arg, { dispatch, extra: { api } }) => {
    try {
      dispatch(setUsersLoading(true));
      const {data} = await api.get<UserApi[]>(`${UrlPaths.Users}`);
      dispatch(setUsers(usersAdapt(data)));
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }
      toast.error(message);
    } finally {
      dispatch(setUsersLoading(false));
    }
  }
);

export const deleteUserApi = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Users}/${UrlPaths.Users}`,
  async (userId, { dispatch, extra: { api } }) => {
    try {
      await api.delete<void>(`${UrlPaths.Users}/${userId}`);
      dispatch(deleteUser(userId));

      toast.success(Message.DeleteElement);
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }
      toast.error(message);
    }
  }
);

export const getEditUserApi = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.Users}/${UrlPaths.Users}`,
  async (userId, { dispatch, extra: { api } }) => {
    try {
      dispatch(setEditUserLoading(true));
      const {data} = await api.get<UserApi>(`${UrlPaths.Users}/${userId}`);

      dispatch(setUserEdit(userAdapt(data)));
      dispatch(setEditUserLoading(false));
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }
      toast.error(message);
    }
  }
);

export const logoutUserApi = createAsyncThunk<void, void, AsyncThunkConfig>(
  `${NameSpace.Users}/${UrlPaths.Users}`,
  async (_userId, { dispatch, extra: { api } }) => {
    try {
      await api.delete<UserApi>(`${UrlPaths.Users}/${UrlPaths.Auth}/${UrlPaths.Logout}`);

      dropTokens();
      dispatch(logout(true));
    } catch(e) {
      let message = Message.UnknownMessage;

      if (isAxiosError(e)) {
        message = e.response?.data.message;
      }
      toast.error(message);
    }
  }
);
