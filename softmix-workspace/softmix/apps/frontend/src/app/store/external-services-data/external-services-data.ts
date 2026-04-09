import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { ExternalService } from '@project-lib/shared-types';

import { NameSpace } from '../../const';

export type ExternalServicesState = {
  services: ExternalService[];
  isLoading: boolean;
  serviceEdit: ExternalService | null;
  isEditLoading: boolean;
  isCreateMode: boolean;
};

const initialState: ExternalServicesState = {
  services: [],
  isLoading: false,
  serviceEdit: null,
  isEditLoading: false,
  isCreateMode: false,
};

export const externalServicesData = createSlice({
  name: NameSpace.ExternalServices,
  initialState,
  reducers: {
    setServices: (state, action: PayloadAction<ExternalService[]>) => {
      state.services = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setServiceEdit: (state, action: PayloadAction<ExternalService | null>) => {
      state.serviceEdit = action.payload;
    },
    setEditLoading: (state, action: PayloadAction<boolean>) => {
      state.isEditLoading = action.payload;
    },
    setCreateMode: (state, action: PayloadAction<boolean>) => {
      state.isCreateMode = action.payload;
    },
  },
});

export const {
  setServices,
  setLoading,
  setServiceEdit,
  setEditLoading,
  setCreateMode,
} = externalServicesData.actions;
