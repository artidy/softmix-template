import { CategoryApi } from '@project-lib/shared-types';

import { Category } from '../../types/category';

export function categoryAdapt(element: CategoryApi): Category {
  return element ? {
    ...element,
    categories: [],
  } : null
}

export function categoriesAdapt(elements: CategoryApi[]): Category[] {
  return elements ? elements.map((element) => categoryAdapt(element)) : [];
}
