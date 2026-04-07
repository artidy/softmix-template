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
import { QueryParams } from '../types/product';
import { setProducts } from '../store/products-data/products-data';

function ShopPage(): ReactElement {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const [currentCategoryId, setCurrentCategoryId] = useState<string | null>(null);
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
    const page = Number(searchParams.get('page')) || DEFAULT_PAGE;
    const categoryId = searchParams.get('categoryId');
    const params: QueryParams = {
      limit: DEFAULT_LIMIT,
      page,
    };

    if (categoryId) {
      params.categoryId = categoryId;
    }

    dispatch(getProductsApi(params));
    setCurrentCategoryId(categoryId);

    return () => {
      dispatch(setProducts([]));
    }
  }, [searchParams]);

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
            <ShopSidebarComponent categories={categories} currentCategoryId={currentCategoryId} />
            <ShopContentComponent products={products} />
          </div>
        </div>
      </div>
    </>
  )
}

export default ShopPage;
