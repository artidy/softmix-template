import { UserRole } from './constants';

export interface User {
  _id?: string;
  name: string;
  login: string;
  role: UserRole;
  passwordHash?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

export interface UserApi {
  id: string;
  name: string;
  login: string;
  role: UserRole;
  passwordHash?: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

export interface UserRequest {
  id: string;
  login: string;
  role: UserRole;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  refreshTokenId?: string;
}

export interface LoginUser {
  login: string;
  password: string;
}
