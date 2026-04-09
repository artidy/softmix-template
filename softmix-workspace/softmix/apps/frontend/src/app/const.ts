import { DEFAULT_PAGE, UserRole } from '@project-lib/shared-types';

import { Pagination } from './types/pagination';

enum AppRoute {
  Main = '/',
  Shop = '/shop',
  Products = '/products',
  Downloads = '/downloads',
  About = '/about',
  Contacts = '/contacts',
  Login = '/login',
  Register = '/register',
  Profile = '/profile',
  Cart = '/cart',
  Users = '/admin/users',
  Settings = '/admin/settings',
  Services = '/admin/services',
  Import = '/admin/import',
  Admin = '/admin',
}

enum NameSpace {
  Categories = 'CATEGORIES',
  Products = 'PRODUCTS',
  Downloads = 'DOWNLOADS',
  Users = 'USERS',
  Cart = 'CART',
  Main = 'MAIN',
  Settings = 'SETTINGS',
  ExternalServices = 'EXTERNAL_SERVICES',
}

enum Message {
  UnknownMessage = 'Неизвестная ошибка, обратитесь к администратору',
  AddNewElement = 'Данные успешно добавлены',
  UpdateElement = 'Данные успешно обновлены',
  DeleteElement = 'Данные успешно удалены',
}

enum DownloadOptions {
  AlStyle = 'Al style',
  Marvel = 'Marvel',
}

const USER_ROLES = [
  {
    role: UserRole.Admin,
    title: 'Администратор'
  },
  {
    role: UserRole.Manager,
    title: 'Менеджер'
  },
  {
    role: UserRole.User,
    title: 'Пользователь'
  }
]

const DEFAULT_PAGINATION: Pagination = {
  first: '',
  prev: '',
  next: '',
  last: '',
  offset: 0,
  page: DEFAULT_PAGE,
  totalPages: DEFAULT_PAGE,
  total: 0,
}

const REQUEST_TIMEOUT = 5000;
const TOKEN = 'token';
const REFRESH_TOKEN = 'refresh-token';
const EXPIRES_IN = 'expires-in';
const DEFAULT_PRODUCT_IMG = 'assets/img/product/1.png';
const UPLOADER_URL = 'http://localhost:7777/';

export {
  AppRoute,
  NameSpace,
  Message,
  DownloadOptions,
  USER_ROLES,
  DEFAULT_PAGINATION,
  REQUEST_TIMEOUT,
  TOKEN,
  REFRESH_TOKEN,
  EXPIRES_IN,
  DEFAULT_PRODUCT_IMG,
  UPLOADER_URL,
}
