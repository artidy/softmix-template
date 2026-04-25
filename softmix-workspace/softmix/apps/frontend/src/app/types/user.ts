export enum UserRole {
  User = 'user',
  Manager = 'manager',
  Admin = 'admin'
}

export enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

export type User = {
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

export type UserApi = User;

export type LoginUser = {
  login: string;
  password: string;
}

export type CreateUser = {
  name: string;
  login: string;
  email?: string;
  password: string;
  role: UserRole;
}

export type UpdateUser = {
  id: string;
  name?: string;
  password?: string;
  role?: UserRole;
}
