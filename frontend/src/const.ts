enum ContactTypes {
  Phone = 'tel',
  Email = 'mailto'
}

enum AppRoutes {
  Main = '/',
  About = '/about',
  Contacts = '/contacts',
  Services = '/services',
  Products = '/products',
  NotFound = '*'
}

enum ApiRoutes {
  Services = '/services',
  Products = '/products',
  Categories = '/categories',
  Users = '/users'
}

enum NameSpace {
  Services = 'SERVICES',
  Products = 'PRODUCTS',
  User = 'USER'
}

enum HTTP_CODE {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
}

enum AuthorizationStatus {
  Auth = 'AUTH',
  NoAuth = 'NO_AUTH',
  Unknown = 'UNKNOWN',
}

enum TokenType {
  Token = 'token',
  RefreshToken = 'refresh-token'
}

const AUTH_TOKEN_KEY_NAME = 'softmix';

export {
  ContactTypes,
  AppRoutes,
  ApiRoutes,
  NameSpace,
  HTTP_CODE,
  AuthorizationStatus,
  TokenType,
  AUTH_TOKEN_KEY_NAME
}
