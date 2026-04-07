import { memo, ReactElement } from 'react';

import { Product } from '../../types/product';
import ProductComponent from '../shop/product.component';
import { useAppSelector } from '../../hooks';
import { getIsNewProductsLoading } from '../../store/main-data/selectors';
import LoaderComponent from '../loader/loader.component';

type ProductsAreaComponentProps = {
  products: Product[];
}

function ProductsAreaComponent({products}: ProductsAreaComponentProps): ReactElement {
  const isLoading = useAppSelector(getIsNewProductsLoading);

  if (isLoading) {
    return <LoaderComponent />
  }

  const productsContent = products.map((product) =>
    <ProductComponent
      key={product.id}
      className="col-xl-3 col-sm-6 col-12"
      imageUrl={product.imageUrl}
      product={product}
    />);

  return (
    <div className="ltn__product-area ltn__product-gutter pt-65 pb-40">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-area text-center">
              <h1 className="section-title section-title-border">Новое поступление</h1>
            </div>
          </div>
        </div>
        <div className="row justify-content-center">
          {productsContent}
        </div>
      </div>
    </div>
  )
}

export default memo(ProductsAreaComponent);
