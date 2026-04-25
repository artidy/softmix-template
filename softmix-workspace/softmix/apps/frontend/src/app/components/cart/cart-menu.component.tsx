import { memo, ReactElement, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../../hooks';
import { AppRoute, DEFAULT_PRODUCT_IMG } from '../../const';
import { getCart } from '../../store/cart-data/selectors';
import { removeFromCart } from '../../store/cart-data/api-actions';
import { formatPrice } from '../../utils/format';

type CartMenuComponentProps = {
  isOpen: boolean;
  onClose: () => void;
};

function CartMenuComponent({ isOpen, onClose }: CartMenuComponentProps): ReactElement {
  const dispatch = useAppDispatch();
  const cart = useAppSelector(getCart);
  const items = cart?.items ?? [];

  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    if (isOpen) {
      document.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
    }
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  const handleRemove = (productId: string) => () => {
    dispatch(removeFromCart(productId));
  };

  const stop = (e: React.MouseEvent) => e.stopPropagation();

  return (
    <>
      {isOpen && (
        <div
          className="cart-menu-backdrop"
          onClick={onClose}
          aria-hidden="true"
        />
      )}
      <aside
        className={`cart-menu-panel${isOpen ? ' cart-menu-panel--open' : ''}`}
        onClick={stop}
        role="dialog"
        aria-label="Корзина"
      >
        <div className="cart-menu-panel__head">
          <span className="cart-menu-panel__title">Корзина</span>
          <button
            type="button"
            className="btn-close"
            aria-label="Закрыть"
            onClick={onClose}
          />
        </div>
        <div className="cart-menu-panel__body">
          {items.length === 0 ? (
            <p className="text-muted text-center my-4">Корзина пуста</p>
          ) : (
            items.map((item) => (
              <div className="cart-menu-item" key={item.productId}>
                <Link to={`${AppRoute.Shop}/${item.productId}`} onClick={onClose} className="cart-menu-item__img">
                  <img src={item.imageUrl || DEFAULT_PRODUCT_IMG} alt={item.title} />
                </Link>
                <div className="cart-menu-item__info">
                  <Link
                    to={`${AppRoute.Shop}/${item.productId}`}
                    onClick={onClose}
                    className="cart-menu-item__title"
                  >
                    {item.title}
                  </Link>
                  <div className="cart-menu-item__qty">
                    {item.quantity} × {formatPrice(item.price)}
                  </div>
                </div>
                <button
                  type="button"
                  className="btn-close cart-menu-item__remove"
                  onClick={handleRemove(item.productId)}
                  aria-label="Удалить"
                />
              </div>
            ))
          )}
        </div>
        <div className="cart-menu-panel__footer">
          <div className="cart-menu-panel__total">
            <span>Всего:</span>
            <strong>{formatPrice(cart?.totalPrice ?? 0)}</strong>
          </div>
          <div className="d-flex gap-2">
            <Link
              to={AppRoute.Cart}
              className="btn btn-outline-primary flex-grow-1"
              onClick={onClose}
            >
              Корзина
            </Link>
            <Link
              to={AppRoute.Checkout}
              className="btn btn-primary flex-grow-1"
              onClick={onClose}
            >
              Оформить
            </Link>
          </div>
        </div>
      </aside>
    </>
  );
}

export default memo(CartMenuComponent);
