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
  Services = '/services'
}

enum NameSpace {
  Services = 'SERVICES',
  Products = 'PRODUCTS',
}

enum HTTP_CODE {
  BAD_REQUEST = 400,
  UNAUTHORIZED = 401,
  NOT_FOUND = 404,
}

const AUTH_TOKEN_KEY_NAME = 'softmix';

export {
  ContactTypes,
  AppRoutes,
  ApiRoutes,
  NameSpace,
  HTTP_CODE,
  AUTH_TOKEN_KEY_NAME
}
