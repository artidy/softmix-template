import { createSelector } from '@reduxjs/toolkit';

import { NameSpace } from '../../const';
import { State } from '../../types/state';
import { ExternalServicesState } from './external-services-data';

export const getExternalServices = createSelector(
  (state: State) => state[NameSpace.ExternalServices],
  (state: ExternalServicesState) => state.services
);

export const getIsExternalServicesLoading = createSelector(
  (state: State) => state[NameSpace.ExternalServices],
  (state: ExternalServicesState) => state.isLoading
);

export const getServiceEdit = createSelector(
  (state: State) => state[NameSpace.ExternalServices],
  (state: ExternalServicesState) => state.serviceEdit
);

export const getIsEditLoading = createSelector(
  (state: State) => state[NameSpace.ExternalServices],
  (state: ExternalServicesState) => state.isEditLoading
);

export const getIsCreateMode = createSelector(
  (state: State) => state[NameSpace.ExternalServices],
  (state: ExternalServicesState) => state.isCreateMode
);
