import { ChangeEvent, memo, MouseEvent, ReactElement, useState } from 'react';
import { DEFAULT_LIMIT } from '@project-lib/shared-types';

import { Product } from '../../types/product';
import ProductDownloadComponent from './product-download.component';
import PanelDownloadComponent from './panel-download.component';
import { useAppDispatch, useAppSelector } from '../../hooks';
import {
  getExcludedProducts,
  getIsProductsLoading,
  getPagination,
  getProducts
} from '../../store/downloads-data/selectors';
import { getAlstyleProductsApi } from '../../store/downloads-data/api-actions';
import LoaderComponent from '../loader/loader.component';
import PaginationComponent from '../pagination/pagination.component';
import { AppRoute } from '../../const';

function ContentDownloadComponent(): ReactElement {
  const dispatch = useAppDispatch();
  const products = useAppSelector(getProducts);
  const productsIsLoading = useAppSelector(getIsProductsLoading);
  const excludedProducts = useAppSelector(getExcludedProducts);
  const currentProducts = products.filter((product) => !excludedProducts.includes(product.downloadId));
  const pagination = useAppSelector(getPagination);
  const [currentCategoryId, setCurrentCategoryId] = useState<number>(0);

  const productsContent = currentProducts.map((product: Product) =>
    <ProductDownloadComponent key={product.id} product={product} />
  );

  const pages = [];

  for (let page = 1; page <= pagination.totalPages; page++) {
    pages.push(page);
  }

  const loadProducts = (pageNumber: number) => {
    dispatch(getAlstyleProductsApi({categoryId: String(currentCategoryId), limit: DEFAULT_LIMIT, page: pageNumber}));
  }

  const onChangeCurrentCategoryHandler = (evt: ChangeEvent<HTMLSelectElement>) => {
    setCurrentCategoryId(+evt.target.value);
  }

  return (
    <div className="col-lg-12 order-lg-2 col-12 mb-100">
      <PanelDownloadComponent
        currentCategoryId={currentCategoryId}
        onChangeCurrentCategoryHandler={onChangeCurrentCategoryHandler}
        loadProducts={loadProducts}
      />
      <div className="tab-content">
        <div className="tab-pane fade active show" id="liton_product_grid">
          <div className="ltn__product-tab-content-inner ltn__product-grid-view">
            <div className="row">
              {productsIsLoading ? <LoaderComponent /> : productsContent}
            </div>
          </div>
        </div>
      </div>
      <PaginationComponent
        appRoute={AppRoute.Downloads}
        pagination={pagination}
      />
    </div>
  )
}

export default memo(ContentDownloadComponent);
