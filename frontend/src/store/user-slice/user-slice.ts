import {createSlice} from '@reduxjs/toolkit';

import {AuthorizationStatus, NameSpace} from '../../const';
import {User} from '../../types/user';

const INITIAL_USER: User | null = null;

const initialState = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: INITIAL_USER,
};

const userSlice = createSlice({
  name: NameSpace.User,
  initialState,
  reducers: {
    requireAuthorization: (state, action) => {
      state.authorizationStatus = action.payload;
    },
    authorization: (state, action) => {
      state.user = action.payload;
    },
  },
});

const {requireAuthorization, authorization} = userSlice.actions;

export {userSlice, requireAuthorization, authorization};
