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

    const response = await api.get<ExternalService[]>(`${UrlPaths.ExternalServices}`);

    if (!isAxiosError(response)) {
      dispatch(setServices(response.data));
    }

    dispatch(setLoading(false));
  }
);

export const createExternalServiceApi = createAsyncThunk<void, Partial<ExternalService>, AsyncThunkConfig>(
  `${NameSpace.ExternalServices}/create`,
  async (createData, { dispatch, extra: { api } }) => {
    const response = await api.post<ExternalService>(`${UrlPaths.ExternalServices}`, createData);

    if (isAxiosError(response)) {
      let message = Message.UnknownMessage;
      if (response.response?.data?.message) {
        message = response.response.data.message;
      }
      toast.error(message);
      return;
    }

    toast.success(Message.AddNewElement);
    dispatch(setCreateMode(false));
    dispatch(getExternalServicesApi());
  }
);

export const updateExternalServiceApi = createAsyncThunk<void, { id: string; data: Partial<ExternalService> }, AsyncThunkConfig>(
  `${NameSpace.ExternalServices}/update`,
  async ({ id, data: updateData }, { dispatch, extra: { api } }) => {
    const response = await api.put<ExternalService>(`${UrlPaths.ExternalServices}/${id}`, updateData);

    if (isAxiosError(response)) {
      let message = Message.UnknownMessage;
      if (response.response?.data?.message) {
        message = response.response.data.message;
      }
      toast.error(message);
      return;
    }

    toast.success(Message.UpdateElement);
    dispatch(setServiceEdit(null));
    dispatch(getExternalServicesApi());
  }
);

export const deleteExternalServiceApi = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.ExternalServices}/delete`,
  async (id, { dispatch, extra: { api } }) => {
    const response = await api.delete(`${UrlPaths.ExternalServices}/${id}`);

    if (isAxiosError(response)) {
      let message = Message.UnknownMessage;
      if (response.response?.data?.message) {
        message = response.response.data.message;
      }
      toast.error(message);
      return;
    }

    toast.success(Message.DeleteElement);
    dispatch(getExternalServicesApi());
  }
);

export const getEditExternalServiceApi = createAsyncThunk<void, string, AsyncThunkConfig>(
  `${NameSpace.ExternalServices}/getEdit`,
  async (id, { dispatch, extra: { api } }) => {
    dispatch(setEditLoading(true));

    const response = await api.get<ExternalService>(`${UrlPaths.ExternalServices}/${id}`);

    if (!isAxiosError(response)) {
      dispatch(setServiceEdit(response.data));
    }

    dispatch(setEditLoading(false));
  }
);
