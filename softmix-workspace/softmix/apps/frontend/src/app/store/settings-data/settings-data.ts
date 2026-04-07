import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SiteSettings } from '@project-lib/shared-types';

import { NameSpace } from '../../const';

export type SettingsState = {
  settings: SiteSettings | null;
  isLoading: boolean;
};

const DEFAULT_SETTINGS: SiteSettings = {
  logoUrl: 'assets/img/logo.png',
  phone: '78-72-06',
  email: 'support@softmix.kz',
  address: 'Астана, ул. Достык 20 БЦ "Санкт-Петербург" офис 401',
  companyDescription: 'Товарищество с ограниченной ответственностью «Soft Mix» образовано 9 октября 2013 года командой профессионалов.',
  copyright: 'Soft Mix',
  socialFacebook: '',
  socialInstagram: '',
  socialTwitter: '',
  socialPinterest: '',
};

const initialState: SettingsState = {
  settings: DEFAULT_SETTINGS,
  isLoading: false,
};

export const settingsData = createSlice({
  name: NameSpace.Settings,
  initialState,
  reducers: {
    setSettings: (state, action: PayloadAction<SiteSettings>) => {
      state.settings = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
  },
});

export const { setSettings, setLoading } = settingsData.actions;
