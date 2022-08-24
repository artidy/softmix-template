import {createSlice} from '@reduxjs/toolkit';

import {AuthorizationStatus, NameSpace} from '../../const';
import {UserSlice} from '../../types/user';

type InitialState = {
  authorizationStatus: AuthorizationStatus,
  user: UserSlice
}

const initialState: InitialState  = {
  authorizationStatus: AuthorizationStatus.Unknown,
  user: null,
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
