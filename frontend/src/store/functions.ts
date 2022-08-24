import {store} from './';
import {authorization, requireAuthorization} from './user-slice';
import {AuthorizationStatus} from '../const';
import {saveToken} from '../services/token';
import adaptUser from '../adapters/user.adapter';
import {UserLogin} from '../types/user';

const setAuthorization = (data: UserLogin): void => {
  saveToken(data.token);
  store.dispatch(requireAuthorization(AuthorizationStatus.Auth));
  store.dispatch(authorization(adaptUser(data)));
}

export {setAuthorization};
