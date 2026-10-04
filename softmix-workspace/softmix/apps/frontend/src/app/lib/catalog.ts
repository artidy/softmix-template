import { Category } from '../types/category';
import { Product } from '../types/product';
import { AppRoute } from '../const';

/** Скидка в процентах: из поля discount или из разницы со старой ценой. */
export function getDiscountPercent({ discount, price, pricePrev }: Pick<Product, 'discount' | 'price' | 'pricePrev'>): number {
  if (discount > 0) {
    return Math.round(discount);
  }
  if (pricePrev > 0 && pricePrev > price) {
    return Math.round((1 - price / pricePrev) * 100);
  }
  return 0;
}

/** Категории верхнего уровня (без родителя) в порядке из админки. */
export function getDirections(categories: Category[]): Category[] {
  return categories.filter((category) => !category.ownerId).sort((a, b) => a.position - b.position);
}

export function categoryLink(categoryId?: string): string {
  return categoryId ? `${AppRoute.Shop}?categoryId=${categoryId}` : AppRoute.Shop;
}

// Неразрывный пробел: обычные пробелы в начале <option> браузер схлопывает.
const NBSP = String.fromCharCode(0xa0);

/** Категории в порядке дерева с отступом по уровню — так в длинном списке видно, где подкатегории. */
export function buildCategoryOptions(categories: Category[]): { id: string; label: string }[] {
  const ids = new Set(categories.map((category) => category.id));
  const children = new Map<string, Category[]>();
  const roots: Category[] = [];

  for (const category of categories) {
    if (category.ownerId && ids.has(category.ownerId)) {
      children.set(category.ownerId, [...(children.get(category.ownerId) ?? []), category]);
    } else {
      roots.push(category);
    }
  }

  const result: { id: string; label: string }[] = [];
  const walk = (list: Category[], depth: number) => {
    for (const category of list) {
      result.push({ id: category.id, label: `${NBSP.repeat(depth * 3)}${category.title}` });
      walk(children.get(category.id) ?? [], depth + 1);
    }
  };
  walk(roots, 0);
  return result;
}

/** Категория и все её подкатегории — товары родителя включают товары детей. */
export function collectCategoryIds(rootId: string, categories: Category[]): string[] {
  const byParent = new Map<string, string[]>();
  for (const category of categories) {
    if (category.ownerId) {
      byParent.set(category.ownerId, [...(byParent.get(category.ownerId) ?? []), category.id]);
    }
  }

  const result: string[] = [];
  const stack = [rootId];
  const visited = new Set<string>();
  while (stack.length > 0) {
    const id = stack.pop() as string;
    if (visited.has(id)) {
      continue;
    }
    visited.add(id);
    result.push(id);
    stack.push(...(byParent.get(id) ?? []));
  }
  return result;
}
