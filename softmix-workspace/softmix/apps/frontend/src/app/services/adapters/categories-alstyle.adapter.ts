import { CategoryAlStyleApi } from '@project-lib/shared-types';

import { Category } from '../../types/category';

export function categoryAlstyleAdapt(element: CategoryAlStyleApi): Category {
  return element ? {
    id: String(element.id),
    title: element.name,
    ownerId: '',
    position: 0,
    categories: [],
  } : null
}

export function categoriesAlstyleAdapt(elements: CategoryAlStyleApi[]): Category[] {
  const result: Category[] = [];

  for (const element of elements) {
    if (element.elements > 0) {
      result.push(categoryAlstyleAdapt(element))
    }
  }

  return result;
}
