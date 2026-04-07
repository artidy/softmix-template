import { createSelector } from '@reduxjs/toolkit';

import { NameSpace } from '../../const';
import { State, UserState } from '../../types/state';
import { AuthorizationStatus, UserRole } from '../../types/user';

export const getAuthorizationStatus = createSelector(
  (state: State) => state[NameSpace.Users],
  (state: UserState) => state.authorizationStatus
);

export const getUser = createSelector(
  (state: State) => state[NameSpace.Users],
  (state: UserState) => state.user
);

export const getUsers = createSelector(
  (state: State) => state[NameSpace.Users],
  (state: UserState) => state.users
);

export const getUserEdit = createSelector(
  (state: State) => state[NameSpace.Users],
  (state: UserState) => state.userEdit
);

export const getIsUsersLoading = createSelector(
  (state: State) => state[NameSpace.Users],
  (state: UserState) => state.isLoading
);

export const getIsUserEditLoading = createSelector(
  (state: State) => state[NameSpace.Users],
  (state: UserState) => state.isEditLoading
);

export const getIsAuth = createSelector(
  getAuthorizationStatus,
  (authorizationStatus: AuthorizationStatus) =>
    authorizationStatus === AuthorizationStatus.Auth
);

export const getIsUnknown = createSelector(
  getAuthorizationStatus,
  (authorizationStatus: AuthorizationStatus) =>
    authorizationStatus === AuthorizationStatus.Unknown
);

export const getIsAdmin = createSelector(
  (state: State) => state[NameSpace.Users],
  (state: UserState) => state.user?.role === UserRole.Admin
);

export const getIsCreateMode = createSelector(
  (state: State) => state[NameSpace.Users],
  (state: UserState) => state.isCreateMode
);
