import { ReactElement, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { DEFAULT_DOWNLOADS_LIMIT, DEFAULT_PAGE } from '@project-lib/shared-types';

import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';
import { AppRoute } from '../const';
import { useAppDispatch, useAppSelector } from '../hooks';
import { setCategories } from '../store/categories-data/categories-data';
import { setProducts } from '../store/products-data/products-data';
import LoaderComponent from '../components/loader/loader.component';
import { getIsCategoriesLoading } from '../store/downloads-data/selectors';
import ContentDownloadComponent from '../components/downloads/content-download.component';
import { getAlstyleCategoriesApi, getAlstyleProductsApi } from '../store/downloads-data/api-actions';
import { QueryParams } from '../types/product';

function DownloadsPage(): ReactElement {
  const dispatch = useAppDispatch();
  const [searchParams] = useSearchParams();
  const isCategoriesLoading = useAppSelector(getIsCategoriesLoading);

  useEffect(() => {
    dispatch(getAlstyleCategoriesApi());

    return () => {
      dispatch(setCategories([]));
      dispatch(setProducts([]));
    }
  }, []);

  useEffect(() => {
    const page = Number(searchParams.get('page')) || DEFAULT_PAGE;
    const categoryId = searchParams.get('categoryId');
    const params: QueryParams = {
      limit: DEFAULT_DOWNLOADS_LIMIT,
      page,
    };

    if (categoryId) {
      params.categoryId = categoryId;
    }

    dispatch(getAlstyleProductsApi(params));

    return () => {
      dispatch(setProducts([]));
    }
  }, [searchParams]);

  if (isCategoriesLoading) {
    return <LoaderComponent />
  }

  return (
    <>
      <BreadcrumbComponent
        title="Загрузки"
        links={[{ title: 'Главная', href: AppRoute.Main }]}
        pageName="Загрузка товаров"
      />
      <div className="ltn__product-area">
        <div className="container">
          <div className="row">
            <ContentDownloadComponent />
          </div>
        </div>
      </div>
    </>
  )
}

export default DownloadsPage;
