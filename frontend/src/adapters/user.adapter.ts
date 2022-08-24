import {User, UserLogin} from '../types/user';

const adaptUser = (user: UserLogin): User => {
  return {id: user.id, email: user.email, name: user.name};
}

export default adaptUser;
