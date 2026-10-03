import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { ExternalService, UrlPaths } from '@project-lib/shared-types';

import { AsyncThunkConfig } from '../../types/thunk-config';
import { Message, NameSpace } from '../../const';
import { setServices, setLoading, setServiceEdit, setEditLoading, setCreateMode } from './external-services-data';

export const getExternalServicesApi = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.ExternalServices}/get`,
  async (_arg, { dispatch, extra: { api } }) => {
    dispatch(setLoading(true));

    try {
      const { data } = await api.get<ExternalService[]>(`${UrlPaths.ExternalServices}`);
      dispatch(setServices(data));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const createExternalServiceApi = createAsyncThunk<void, Partial<ExternalService>, AsyncThunkConfig>(
  `${NameSpace.ExternalServices}/create`,
  async (createData, { dispatch, extra: { api } }) => {
    try {
      await api.post<ExternalService>(`${UrlPaths.ExternalServices}`, createData);
      toast.success(Message.AddNewElement);
      dispatch(setCreateMode(false));
      dispatch(getExternalServicesApi());
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data?.message || message;
      }
      toast.error(message);
    }
  }
);

export const updateExternalServiceApi = createAsyncThunk<void, { id: string; data: Partial<ExternalService> }, AsyncThunkConfig>(
  `${NameSpace.ExternalServices}/update`,
  async ({ id, data: updateData }, { dispatch, extra: { api } }) => {
    try {
      await api.put<ExternalService>(`${UrlPaths.ExternalServices}/${id}`, updateData);
      toast.success(Message.UpdateElement);
      dispatch(setServiceEdit(null));
      dispatch(getExternalServicesApi());
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data?.message || message;
      }
      toast.error(message);
    }
  }
);

export const deleteExternalServiceApi = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.ExternalServices}/delete`,
  async (id, { dispatch, extra: { api } }) => {
    try {
      await api.delete(`${UrlPaths.ExternalServices}/${id}`);
      toast.success(Message.DeleteElement);
      dispatch(getExternalServicesApi());
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data?.message || message;
      }
      toast.error(message);
    }
  }
);

export const getEditExternalServiceApi = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.ExternalServices}/getEdit`,
  async (id, { dispatch, extra: { api } }) => {
    dispatch(setEditLoading(true));

    try {
      const { data } = await api.get<ExternalService>(`${UrlPaths.ExternalServices}/${id}`);
      dispatch(setServiceEdit(data));
    } finally {
      dispatch(setEditLoading(false));
    }
  }
);
