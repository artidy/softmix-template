import { User, UserApi } from '../../types/user';

export function userAdapt(user: UserApi): User {
  return user ? {
    ...user
  } : null
}

export function usersAdapt(users: UserApi[]): User[] {
  return users ? users.map((user) => userAdapt(user)) : [];
}
