import { store } from '../store';
import { AuthorizationStatus, User } from './user';
import { Category } from './category';
import { Product } from './product';
import { Pagination } from './pagination';
import { FileUrl } from './upload-file';

export type UserState = {
  authorizationStatus: AuthorizationStatus;
  user: User | null;
  users: User[];
  userEdit: User | null;
  isLoading: boolean;
  isEditLoading: boolean;
  isCreateMode: boolean;
};

export type CategoriesData = {
  categories: Category[];
  isLoading: boolean;
  categoryEdit: Category | null;
  isEditLoading: boolean;
  isCreateMode: boolean;
};

export type ProductData = {
  products: Product[];
  pagination: Pagination;
  images: FileUrl[];
  isLoading: boolean;
  productEdit: Product | null;
  isEditLoading: boolean;
  isCreateMode: boolean;
};

export type DownloadsData = {
  categories: Category[];
  products: Product[];
  excludedProducts: number[];
  newProducts: Product[];
  pagination: Pagination;
  isCategoriesLoading: boolean;
  isProductsLoading: boolean;
};

export type MainData = {
  newProducts: Product[];
  hotProducts: Product[];
  isNewProductsLoading: boolean;
  isHotProductsLoading: boolean;
};

export type State = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export type { OrdersState } from './order';
