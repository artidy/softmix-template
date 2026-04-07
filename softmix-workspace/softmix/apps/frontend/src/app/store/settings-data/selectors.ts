import { createSelector } from '@reduxjs/toolkit';

import { NameSpace } from '../../const';
import { State } from '../../types/state';
import { SettingsState } from './settings-data';

export const getSettings = createSelector(
  (state: State) => state[NameSpace.Settings],
  (state: SettingsState) => state.settings
);

export const getIsSettingsLoading = createSelector(
  (state: State) => state[NameSpace.Settings],
  (state: SettingsState) => state.isLoading
);
