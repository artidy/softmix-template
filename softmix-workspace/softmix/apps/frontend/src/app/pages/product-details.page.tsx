import { memo, ReactElement, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks';
import { getIsEditLoading, getProductEdit } from '../store/products-data/selectors';
import { getProductApi } from '../store/products-data/api-actions';
import LoaderComponent from '../components/loader/loader.component';
import ProductDetailsComponent from '../components/products/product-details.component';
import { AppRoute } from '../const';
import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';

function ProductDetailsPage(): ReactElement {
  const {id} = useParams();
  const dispatch = useAppDispatch();
  const product = useAppSelector(getProductEdit);
  const isLoading = useAppSelector(getIsEditLoading);

  useEffect(() => {
    dispatch(getProductApi(id));
  }, [id]);

  if (!id || !product) {
    return <div>Не найден элемент</div>
  }

  if (isLoading) {
    return <LoaderComponent />
  }

  return (
    <>
      <BreadcrumbComponent
        title="Товары"
        links={[
          {title: 'Главная', href: AppRoute.Main},
          {title: 'Каталог', href: AppRoute.Shop}
        ]}
        pageName="Описание продукта"
      />
      <div className="ltn__shop-details-area pb-70">
        <div className="container">
          <div className="row">
            <div className="col-lg-12 col-md-12">
              <ProductDetailsComponent
                id={product.id}
                title={product.title}
                imgUrl={product.imageUrl}
                description={product.description}
                price={product.price}
                prevPrice={product.pricePrev}
                categoryId={product.categoryId}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default memo(ProductDetailsPage);
