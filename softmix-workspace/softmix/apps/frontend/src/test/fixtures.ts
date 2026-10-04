import { CategoryApi, ProductApi } from '@project-lib/shared-types';

import { Category } from '../app/types/category';

/** Категория в формате API. */
export function apiCategory(id: string, title: string, ownerId: string | null = null, position = 0): CategoryApi {
  return { id, title, ownerId, position } as unknown as CategoryApi;
}

/** Категория в формате фронтенда (после адаптера). */
export function category(id: string, title: string, ownerId: string | null = null, position = 0): Category {
  return { id, title, ownerId: ownerId as string, position, categories: [] };
}

let counter = 0;

/** Товар в формате API с разумными значениями по умолчанию. */
export function apiProduct(patch: Partial<ProductApi> = {}): ProductApi {
  counter += 1;
  return {
    id: `product-${counter}`,
    title: `Товар ${counter}`,
    price: 10000,
    pricePrev: 0,
    imageUrl: `https://img.example.com/${counter}.jpg`,
    description: 'Описание товара',
    discount: 0,
    category: apiCategory('cat-1', 'Мониторы'),
    categoryId: 'cat-1',
    isHot: false,
    downloadId: 0,
    downloadCompany: '',
    ...patch,
  } as ProductApi;
}
