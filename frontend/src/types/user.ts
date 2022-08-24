import Token from './token';

type User = {
  id: number;
  email: string;
  name: string;
}

type UserLogin = User & {
  token: Token;
  refreshToken: Token;
}

type UserAuth = {
  email: string;
  password: string;
}

export type {User, UserLogin, UserAuth};
