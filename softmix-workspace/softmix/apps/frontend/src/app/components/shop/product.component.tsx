import { ChangeEvent, FormEvent, memo, MouseEvent, ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

import { Product } from '../../types/product';
import BadgeDiscountComponent from '../badges/badge-discount.component';
import BadgeHotComponent from '../badges/badge-hot.component';
import { AppRoute } from '../../const';
import ModalComponent from '../modal/modal.component';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getCanManageProducts } from '../../store/user-data/selectors';
import ProductEditComponent from '../products/product-edit.component';
import DeleteControlFormComponent from '../delete-control-form/delete-control-form.component';
import { deleteProductApi, uploadImage } from '../../store/products-data/api-actions';
import { addToCart } from '../../store/cart-data/api-actions';
import UploadImageComponent from '../upload/upload-image.component';
import { formatPrice } from '../../utils/format';

type ProductComponentProps = {
  product: Product;
  imageUrl: string;
  className: string;
}

function ProductComponent({product,imageUrl, className}: ProductComponentProps): ReactElement {
  const dispatch = useAppDispatch();
  const [modalIsOpen, setModalIsOpen] = useState(false);
  const [modalDeleteIsOpen, setModalDeleteIsOpen] = useState(false);
  const canManage = useAppSelector(getCanManageProducts);

  const onAddToCart = (evt: MouseEvent) => {
    evt.preventDefault();
    dispatch(addToCart({
      productId: product.id,
      title: product.title,
      price: product.price,
      quantity: 1,
      imageUrl,
    }));
  };

  const onOpenModalHandler = (evt: MouseEvent) => {
    setModalIsOpen(true);
  }

  const onCloseModalHandler = (evt: MouseEvent) => {
    setModalIsOpen(false);
  }

  const onActionDelete = (evt: MouseEvent) => {
    setModalDeleteIsOpen(true);
  }

  const onChangeImage = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.files) {
      return;
    }

    const file = evt.target.files[0];

    dispatch(uploadImage({ ownerId: product.id, name: file.name, file }));
  }

  const onCancelDelete = (evt: MouseEvent) => {
    setModalDeleteIsOpen(false);
  }

  const onDeleteHandler = (evt: FormEvent) => {
    evt.preventDefault();

    dispatch(deleteProductApi(product.id));
  }

  const badge = product.discount > 0 ?
    <BadgeDiscountComponent discount={product.discount} /> :
      product.isHot ? <BadgeHotComponent /> : null;

  return (
    <div className={className}>
      <div className="ltn__product-item text-center">
        <div className="product-img product-img--fixed">
          <Link to={`${AppRoute.Shop}/${product.id}`}>
            <img src={imageUrl} alt={product.title}/>
          </Link>
          {badge}
          {canManage ?
            <div className="btn-product-control">
              <button className="btn-edit" onClick={onOpenModalHandler}>
                <i className="fa fa-pen"></i>
              </button>
              <button className="btn-delete" onClick={onActionDelete}>
                <i className="fa fa-trash"></i>
              </button>
              <UploadImageComponent onChangeImage={onChangeImage} />
            </div> : null
          }
          <div className="product-hover-action product-hover-action-2">
            <ul>
              <li className="add-to-cart">
                <button type="button" onClick={onAddToCart} title="В корзину">
                  <span className="cart-text d-none d-xl-block">В корзину</span>
                  <span className="d-block d-xl-none">
                    <i className="icon-cart"></i>
                  </span>
                </button>
              </li>
              <li className="add-to-cart">
                <Link to={`${AppRoute.Shop}/${product.id}`} title="Подробнее">
                  <span className="cart-text d-none d-xl-block">Подробнее</span>
                  <span className="d-block d-xl-none">
                    <i className="icon-magnifier"></i>
                  </span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
        <div className="product-info product-info--fixed">
          <h2 className="product-title">
            <Link to={`${AppRoute.Shop}/${product.id}`}>{product.title}</Link>
          </h2>
          <div className="product-price">
            {product.discount > 0 && product.pricePrev > 0 && (
              <del className="me-2 text-muted">{formatPrice(product.pricePrev)}</del>
            )}
            <span>{formatPrice(product.price)}</span>
          </div>
        </div>
      </div>
      {canManage ?
        <>
          <ModalComponent
            isOpen={modalIsOpen}
            onCloseHandler={onCloseModalHandler}
            children={<ProductEditComponent product={product} onCloseHandler={onCloseModalHandler}/>}
          />
          <ModalComponent
            isOpen={modalDeleteIsOpen}
            onCloseHandler={onCancelDelete}
            children={<DeleteControlFormComponent
              onDeleteHandler={onDeleteHandler} onCancelHandler={onCancelDelete} />}
          />
        </>: null
      }
    </div>
  )
}

export default memo(ProductComponent);
