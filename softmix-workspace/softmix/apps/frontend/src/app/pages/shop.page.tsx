import { ReactElement, useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_LIMIT, DEFAULT_PAGE } from '@project-lib/shared-types';

import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';
import { AppRoute } from '../const';
import ShopContentComponent from '../components/shop/shop-content.component';
import ShopSidebarComponent from '../components/sidebars/shop-sidebar.component';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getCategoriesApi } from '../store/categories-data/api-actions';
import { setCategories } from '../store/categories-data/categories-data';
import { getImagesApi, getProductsApi } from '../store/products-data/api-actions';
import { getCategories } from '../store/categories-data/selectors';
import { getProducts } from '../store/products-data/selectors';
import { Category } from '../types/category';
import { QueryParams } from '../types/product';
import { setProducts } from '../store/products-data/products-data';

function collectCategoryAndDescendants(rootId: string, categories: Category[]): string[] {
  const byParent = new Map<string, string[]>();
  for (const c of categories) {
    if (!c.id) continue;
    const parentId = c.ownerId ?? '';
    if (!byParent.has(parentId)) byParent.set(parentId, []);
    byParent.get(parentId)!.push(c.id);
  }

  const result: string[] = [];
  const stack = [rootId];
  const visited = new Set<string>();
  while (stack.length > 0) {
    const id = stack.pop()!;
    if (visited.has(id)) continue;
    visited.add(id);
    result.push(id);
    const children = byParent.get(id);
    if (children) stack.push(...children);
  }
  return result;
}

function ShopPage(): ReactElement {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const categories = useAppSelector(getCategories);
  const products = useAppSelector(getProducts);

  useEffect(() => {
    dispatch(getCategoriesApi());
    dispatch(getImagesApi());

    return () => {
      dispatch(setCategories([]));
    }
  }, []);

  useEffect(() => {
    setIsSidebarOpen(false);
  }, [searchParams]);

  useEffect(() => {
    const page = Number(searchParams.get('page')) || DEFAULT_PAGE;
    const categoryId = searchParams.get('categoryId');
    const sortBy = searchParams.get('sortBy');
    const params: QueryParams = {
      limit: DEFAULT_LIMIT,
      page,
    };

    if (categoryId) {
      const ids = categories.length > 0
        ? collectCategoryAndDescendants(categoryId, categories)
        : [categoryId];

      if (ids.length > 1) {
        params.categoryIds = ids;
      } else {
        params.categoryId = categoryId;
      }
    }

    if (sortBy) {
      params.sortBy = sortBy;
    }

    dispatch(getProductsApi(params));
    setCurrentCategoryId(categoryId);

    return () => {
      dispatch(setProducts([]));
    }
  }, [searchParams, categories]);

  return (
    <>
      <BreadcrumbComponent
        title="Товары"
        links={[{ title: 'Главная', href: AppRoute.Main }]}
        pageName="Каталог"
      />
      <div className="ltn__product-area ">
        <div className="container">
          <div className="row">
            <ShopSidebarComponent
              categories={categories}
              currentCategoryId={currentCategoryId}
              isOpen={isSidebarOpen}
              onClose={() => setIsSidebarOpen(false)}
            />
            <ShopContentComponent
              products={products}
              onOpenSidebar={() => setIsSidebarOpen(true)}
            />
          </div>
        </div>
      </div>
    </>
  )
}

export default ShopPage;
