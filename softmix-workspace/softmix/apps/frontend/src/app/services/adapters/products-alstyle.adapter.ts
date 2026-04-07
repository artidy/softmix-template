import { ProductAlStyleApi } from '@project-lib/shared-types';

import { Product } from '../../types/product';
import { DownloadOptions } from '../../const';

export function productAlstyleAdapt(element: ProductAlStyleApi): Product {
  return element ? {
    id: String(element.article),
    title: element.name,
    description: element.full_name,
    price: element.price2,
    pricePrev: 0,
    imageUrl: element.images[0],
    discount: 0,
    category: null,
    categoryId: '',
    isHot: false,
    downloadId: element.article,
    downloadCompany: DownloadOptions.AlStyle,
  } : null
}

export function productsAlstyleAdapt(elements: ProductAlStyleApi[]): Product[] {
  return elements ? elements.map((element) => productAlstyleAdapt(element)) : [];
}
