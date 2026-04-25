enum UserRole {
  User = 'user',
  Manager = 'manager',
  Admin = 'admin'
}

enum UrlPaths {
  Auth = 'auth',
  Users = 'users',
  Verify = 'jwt/verify',
  Login = 'login',
  Register = 'register',
  Refresh = 'refresh',
  Logout = 'logout',
  Categories = 'categories',
  Products = 'products',
  Uploader = 'uploader',
  Settings = 'settings',
  ExternalServices = 'external-services',
  ServiceProxy = 'service-proxy',
  Orders = 'orders',
  Cart = 'cart',
}

enum AlStyleRoutes {
  AlStyle = '/al-style',
  Categories = '/categories',
  Products = '/elements-pagination',
  Images = '/images',
}

enum PasswordLength {
  Min = 6,
  Max = 12,
}

enum TitleLength {
  Min = 1,
  Max = 100,
}

enum Port {
  Min = 0,
  Max = 65535
}

enum DtoValidationMessage {
  IncorrectLength = 'Некорректная длина',
  ArrayIsNotContains = 'Недопустимое значение',
  TooLowNumber = 'Значение должно быть больше',
  TooHighNumber = 'Значение должно быть меньше',
  IsNotInteger = 'Значение должно быть целым числом в поле',
  IsEmpty = 'должно быть заполнено',
  IncorrectEmail = 'Неверный формат электронной почты',
  IsNotDate = 'Неверный формат даты',
  IsNotMongoId = 'Неверный формат идентификатора'
}

enum ProductImageSettings {
  Directory = '/img/products',
  FieldName = 'file',
  MaxSize = 500000,
}

const DEFAULT_LIMIT = 21;
const DEFAULT_DOWNLOADS_LIMIT = 24;
const DEFAULT_PAGE= 1;
const IMAGE_TYPES = /(jpg|jpeg|png)$/;
const ASSETS_DIRECTORY = 'assets';

export {
  UserRole,
  UrlPaths,
  AlStyleRoutes,
  PasswordLength,
  TitleLength,
  Port,
  DtoValidationMessage,
  ProductImageSettings,
  DEFAULT_LIMIT,
  DEFAULT_DOWNLOADS_LIMIT,
  DEFAULT_PAGE,
  IMAGE_TYPES,
  ASSETS_DIRECTORY,
}
