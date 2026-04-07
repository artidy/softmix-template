import { memo, MouseEvent, ReactElement, useState } from 'react';

import OptionsComponent from './options.component';
import ProductComponent from './product.component';
import { Product } from '../../types/product';
import ProductAddComponent from '../products/product-add.component';
import ModalComponent from '../modal/modal.component';
import { useAppSelector } from '../../hooks';
import { getIsAuth } from '../../store/user-data/selectors';
import { getImages, getIsLoading, getProductsPagination } from '../../store/products-data/selectors';
import LoaderComponent from '../loader/loader.component';
import PaginationComponent from '../pagination/pagination.component';
import { AppRoute } from '../../const';
import { getImageUrl } from '../../services/helpers';

type ShopContentComponentProps = {
  products: Product[];
}

function ShopContentComponent({products}: ShopContentComponentProps): ReactElement {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const productsIsLoading = useAppSelector(getIsLoading);
  const pagination = useAppSelector(getProductsPagination);
  const images = useAppSelector(getImages);
  const isAuth = useAppSelector(getIsAuth);

  if (productsIsLoading) {
    return <LoaderComponent />
  }

  const onOpenModalHandler = (evt: MouseEvent) => {
    setModalIsOpen(true);
  }

  const onCloseModalHandler = (evt: MouseEvent) => {
    setModalIsOpen(false);
  }

  const productsContent = products.map((product: Product) =>
    <ProductComponent
      key={product.id}
      imageUrl={getImageUrl(images, product.id, product.imageUrl)}
      className="col-xl-4 col-sm-6 col-12"
      product={product}
    />)

  return (
    <div className="col-lg-9 order-lg-2 mb-100">
      <OptionsComponent />
      {isAuth ?
        <button className="tbtn btn-transparent btn-border btn-effect-4 mb-3" onClick={onOpenModalHandler}>
          Добавить товар
        </button> : null
      }
      <div className="tab-content">
        <div className="tab-pane fade active show" id="liton_product_grid">
          <div className="ltn__product-tab-content-inner ltn__product-grid-view">
            <div className="row">
              {productsContent}
            </div>
          </div>
        </div>
      </div>
      <PaginationComponent
        appRoute={AppRoute.Shop}
        pagination={pagination}
      />
      {isAuth ?
        <ModalComponent
          isOpen={modalIsOpen}
          onCloseHandler={onCloseModalHandler}
          children={<ProductAddComponent onCloseHandler={onCloseModalHandler}/>}
        /> : null
      }
    </div>
  )
}

export default memo(ShopContentComponent);
