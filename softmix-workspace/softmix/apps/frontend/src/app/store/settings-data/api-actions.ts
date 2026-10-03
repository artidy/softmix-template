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

    try {
      const { data } = await api.get<SiteSettings>(`${UrlPaths.Settings}`);
      dispatch(setSettings(data));
    } finally {
      dispatch(setLoading(false));
    }
  }
);

export const updateSettingsApi = createAsyncThunk<void, Partial<SiteSettings>, AsyncThunkConfig>(
  `${NameSpace.Settings}/update`,
  async (updateData, { dispatch, extra: { api } }) => {
    try {
      const { data } = await api.put<SiteSettings>(`${UrlPaths.Settings}`, updateData);
      dispatch(setSettings(data));
      toast.success(Message.UpdateElement);
    } catch (e) {
      let message = Message.UnknownMessage;
      if (isAxiosError(e)) {
        message = e.response?.data?.message || message;
      }
      toast.error(message);
    }
  }
);
