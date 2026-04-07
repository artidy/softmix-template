import { createSlice } from '@reduxjs/toolkit';

import { UserState } from '../../types/state';
import { NameSpace } from '../../const';
import { AuthorizationStatus } from '../../types/user';

const initialState: UserState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
  users: [],
  userEdit: null,
  isLoading: false,
  isEditLoading: false,
  isCreateMode: false,
};

export const userData = createSlice({
  name: NameSpace.Users,
  initialState,
  reducers: {
    setAuthorizationStatus: (state, action) => {
      state.authorizationStatus = action.payload;
    },
    setUser: (state, action) => {
      state.user = action.payload;
    },
    setUsers: (state, action) => {
      state.users = action.payload;
    },
    setUserEdit: (state, action) => {
      state.userEdit = action.payload;
    },
    updateUser: (state, action) => {
      const index = state.users.findIndex(
        (user) => user.id === action.payload.id
      );
      state.users[index] = action.payload;
    },
    deleteUser: (state, action) => {
      const idxUser = state.users.findIndex((user) => user.id === action.payload);
      state.users = [...state.users.slice(0, idxUser), ...state.users.slice(idxUser + 1)];
    },
    setUsersLoading: (state, action) => {
      state.isLoading = action.payload;
    },
    setEditUserLoading: (state, action) => {
      state.isEditLoading = action.payload;
    },
    setCreateMode: (state, action) => {
      state.isCreateMode = action.payload;
    },
    addUser: (state, action) => {
      state.users.push(action.payload);
    },
    logout: (state, action) => {
      state.authorizationStatus = AuthorizationStatus.NoAuth;
      state.user = initialState.user;
      state.users = initialState.users;
      state.userEdit = initialState.userEdit;
      state.isLoading = initialState.isLoading;
      state.isEditLoading = initialState.isEditLoading;
    },
  },
});

export const {
  setAuthorizationStatus,
  setUser,
  setUsers,
  setUserEdit,
  setUsersLoading,
  setEditUserLoading,
  updateUser,
  logout,
  deleteUser,
  setCreateMode,
  addUser,
} = userData.actions;
