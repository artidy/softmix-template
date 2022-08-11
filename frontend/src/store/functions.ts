import {store} from './';
import {authorization, requireAuthorization} from './user-slice';
import {AuthorizationStatus} from '../const';
import {saveToken} from '../services/token';
import UserApi from '../types/user-api';
import adaptUser from '../adapters/user.adapter';

const setAuthorization = (data: UserApi): void => {
  saveToken(data.token);
  store.dispatch(requireAuthorization(AuthorizationStatus.Auth));
  store.dispatch(authorization(adaptUser(data)));
}

export {setAuthorization};
