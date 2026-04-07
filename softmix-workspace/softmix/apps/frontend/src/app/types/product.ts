import { Category } from './category';
import { Pagination } from './pagination';

export interface Product {
  id: string;
  title: string;
  price: number;
  pricePrev: number;
  imageUrl: string;
  description: string;
  discount: number;
  category: Category;
  categoryId: string;
  isHot: boolean;
  downloadId: number;
  downloadCompany: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface ProductsQueryParams {
  categoryId?: number;
  limit?: number;
  offset?: number;
}

export interface QueryParams {
  categoryId?: string;
  page?: number;
  limit?: number;
  offset?: number;
}

export interface ProductsPagination {
  products: Product[];
  pagination: Pagination;
}
