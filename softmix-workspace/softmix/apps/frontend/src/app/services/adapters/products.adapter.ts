import { ProductApi } from '@project-lib/shared-types';

import { Product } from '../../types/product';
import { categoryAdapt } from './categories.adapter';
import { DEFAULT_PRODUCT_IMG } from '../../const';

export function productAdapt(element: ProductApi): Product {
  return element ? {
    ...element,
    imageUrl: element.imageUrl ? element.imageUrl : DEFAULT_PRODUCT_IMG,
    category: categoryAdapt(element.category),
  } : null
}

export function productsAdapt(elements: ProductApi[]): Product[] {
  return elements ? elements.map((element) => productAdapt(element)) : [];
}
