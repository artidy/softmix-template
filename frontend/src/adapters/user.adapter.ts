import User from '../types/user';
import UserApi from '../types/user-api';

const adaptUser = (user: UserApi): User => {
  return user ? {id: user.id, email: user.email} : null;
}

export default adaptUser;
