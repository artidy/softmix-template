import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'react-toastify';
import { isAxiosError } from 'axios';
import { SiteSettings, UrlPaths } from '@project-lib/shared-types';

import { AsyncThunkConfig } from '../../types/thunk-config';
import { Message, NameSpace } from '../../const';
import { setSettings, setLoading } from './settings-data';

export const getSettingsApi = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Settings}/get`,
  async (_arg, { dispatch, extra: { api } }) => {
    dispatch(setLoading(true));

    const response = await api.get<SiteSettings>(`${UrlPaths.Settings}`);

    if (!isAxiosError(response)) {
      dispatch(setSettings(response.data));
    }

    dispatch(setLoading(false));
  }
);

export const updateSettingsApi = createAsyncThunk<void, Partial<SiteSettings>, AsyncThunkConfig>(
  `${NameSpace.Settings}/update`,
  async (updateData, { dispatch, extra: { api } }) => {
    const response = await api.put<SiteSettings>(`${UrlPaths.Settings}`, updateData);

    if (isAxiosError(response)) {
      let message = Message.UnknownMessage;
      if (response.response?.data?.message) {
        message = response.response.data.message;
      }
      toast.error(message);
      return;
    }

    dispatch(setSettings(response.data));
    toast.success(Message.UpdateElement);
  }
);
