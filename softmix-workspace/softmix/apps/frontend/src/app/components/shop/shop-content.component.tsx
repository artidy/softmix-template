import { memo, MouseEvent, ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

import OptionsComponent from './options.component';
import ProductComponent from './product.component';
import { Product } from '../../types/product';
import ProductAddComponent from '../products/product-add.component';
import ModalComponent from '../modal/modal.component';
import { useAppSelector } from '../../hooks';
import { getCanManageProducts } from '../../store/user-data/selectors';
import { getImages, getIsLoading, getProductsPagination } from '../../store/products-data/selectors';
import PaginationComponent from '../pagination/pagination.component';
import { AppRoute } from '../../const';
import { getImageUrl } from '../../services/helpers';

type ViewMode = 'grid' | 'list';

type ShopContentComponentProps = {
  products: Product[];
  onOpenSidebar?: () => void;
};

const SKELETON_COUNT = 8;

function ShopContentComponent({ products, onOpenSidebar }: ShopContentComponentProps): ReactElement {
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [view, setView] = useState<ViewMode>('grid');
  const productsIsLoading = useAppSelector(getIsLoading);
  const pagination = useAppSelector(getProductsPagination);
  const images = useAppSelector(getImages);
  const canManage = useAppSelector(getCanManageProducts);

  const onOpenModalHandler = (_evt: MouseEvent) => {
    setModalIsOpen(true);
  };

  const onCloseModalHandler = (_evt: MouseEvent) => {
    setModalIsOpen(false);
  };

  const cardClassName =
    view === 'grid'
      ? 'col-xxl-3 col-lg-4 col-md-6 col-12'
      : 'col-12';

  const productsContent = products.map((product: Product) => (
    <ProductComponent
      key={product.id}
      imageUrl={getImageUrl(images, product.id, product.imageUrl)}
      className={cardClassName}
      product={product}
      view={view}
    />
  ));

  return (
    <div className="col-lg-9 order-lg-2 mb-100 shop-content">
      <OptionsComponent
        view={view}
        onChangeView={setView}
        onOpenSidebar={onOpenSidebar}
        onAddProduct={canManage ? () => setModalIsOpen(true) : undefined}
      />

      {productsIsLoading ? (
        <div className="row g-3">
          {Array.from({ length: SKELETON_COUNT }).map((_, i) => (
            <div key={i} className={cardClassName}>
              <div className="product-skeleton">
                <div className="product-skeleton__img" />
                <div className="product-skeleton__line product-skeleton__line--title" />
                <div className="product-skeleton__line product-skeleton__line--title-2" />
                <div className="product-skeleton__line product-skeleton__line--price" />
              </div>
            </div>
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="shop-empty">
          <div className="shop-empty__icon">📦</div>
          <h3 className="shop-empty__title">Товаров не найдено</h3>
          <p className="shop-empty__text">
            В этой категории пока нет товаров. Попробуйте выбрать другую категорию или вернитесь в каталог.
          </p>
          <Link to={AppRoute.Shop} className="btn btn-primary">
            Вернуться в каталог
          </Link>
        </div>
      ) : (
        <div className="row g-3">{productsContent}</div>
      )}

      <PaginationComponent appRoute={AppRoute.Shop} pagination={pagination} />

      {canManage && (
        <ModalComponent
          isOpen={modalIsOpen}
          onCloseHandler={onCloseModalHandler}
          title="Добавить товар"
          size="lg"
          children={<ProductAddComponent onCloseHandler={onCloseModalHandler} />}
        />
      )}
    </div>
  );
}

export default memo(ShopContentComponent);
