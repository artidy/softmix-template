import { Category, CategoryApi } from '@project-lib/shared-types';

export interface Product {
  id: string;
  title: string;
  price: number;
  pricePrev: number;
  imageUrl: string;
  description: string;
  discount: number;
  category: Category;
  isHot: boolean;
  downloadId: number;
  downloadCompany: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductApi {
  id: string;
  title: string;
  price: number;
  pricePrev: number;
  imageUrl: string;
  description: string;
  discount: number;
  category: CategoryApi;
  categoryId: string;
  isHot: boolean;
  downloadId: number;
  downloadCompany: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductsPaginationApi {
  products: ProductApi[];
  total: number;
}

export interface ProductCreate {
  title: string;
  price: number;
  pricePrev: number;
  imageUrl?: string;
  description: string;
  discount?: number;
  categoryId: string;
  isHot: boolean;
  downloadId?: number;
  downloadCompany?: string;
}

export interface ProductUpdate {
  id?: string;
  title?: string;
  price?: number;
  pricePrev?: number;
  imageUrl?: string;
  description?: string;
  discount?: number;
  categoryId?: string;
  isHot?: boolean;
  downloadId?: number;
  downloadCompany?: string;
}
