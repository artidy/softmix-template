import { createAsyncThunk } from '@reduxjs/toolkit';
import { toast } from 'sonner';
import { isAxiosError } from 'axios';
import { SiteSettings, UrlPaths } from '@project-lib/shared-types';

import { AsyncThunkConfig } from '../../types/thunk-config';
import { Message, NameSpace } from '../../const';
import { setSettings, setLoading } from './settings-data';
import { rememberLogo } from './logo-cache';

export const getSettingsApi = createAsyncThunk<void, undefined, AsyncThunkConfig>(
  `${NameSpace.Settings}/get`,
  async (_arg, { dispatch, extra: { api } }) => {
    dispatch(setLoading(true));

    try {
      const { data } = await api.get<SiteSettings>(`${UrlPaths.Settings}`);
      dispatch(setSettings(data));
      rememberLogo(data.logoUrl);
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
      rememberLogo(data.logoUrl);
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
