import User from '../types/user';

const adaptUser = (user: User): User => {
  return user ? {...user} : null;
}

export default adaptUser;
