import { ChangeEvent, ReactElement, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute, DEFAULT_PRODUCT_IMG } from '../const';
import { getCart, getCartLoading } from '../store/cart-data/selectors';
import {
  clearCart,
  getCart as fetchCart,
  removeFromCart,
  updateCartItem,
} from '../store/cart-data/api-actions';
import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';
import Loader from '../components/loader/loader.component';
import { formatPrice } from '../utils/format';

function CartPage(): ReactElement {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const cart = useAppSelector(getCart);
  const isLoading = useAppSelector(getCartLoading);

  useEffect(() => {
    dispatch(fetchCart());
  }, [dispatch]);

  const handleQuantityChange = (productId: string) => (evt: ChangeEvent<HTMLInputElement>) => {
    const quantity = Math.max(1, Number(evt.target.value) || 1);
    dispatch(updateCartItem({ productId, dto: { quantity } }));
  };

  const handleRemove = (productId: string) => () => {
    dispatch(removeFromCart(productId));
  };

  const handleClear = () => {
    if (window.confirm('Очистить корзину?')) {
      dispatch(clearCart());
    }
  };

  const handleCheckout = () => {
    navigate(AppRoute.Checkout);
  };

  if (isLoading && !cart) {
    return <Loader />;
  }

  const items = cart?.items ?? [];
  const isEmpty = items.length === 0;

  return (
    <>
      <BreadcrumbComponent
        title="Корзина"
        links={[{ title: 'Главная', href: AppRoute.Main }]}
        pageName="Корзина"
      />
      <div className="liton__shoping-cart-area mb-105">
        <div className="container">
          {isEmpty ? (
            <div className="row">
              <div className="col-lg-12 text-center py-5">
                <h3>Ваша корзина пуста</h3>
                <p>Добавьте товары из каталога — мы их сохраним даже без регистрации.</p>
                <Link to={AppRoute.Shop} className="theme-btn-1 btn btn-effect-1 mt-3">
                  Перейти в каталог
                </Link>
              </div>
            </div>
          ) : (
            <div className="row g-4">
              <div className="col-lg-8">
                <div className="cart-list">
                  <div className="cart-list__head d-none d-md-flex">
                    <div className="cart-list__col cart-list__col--product">Товар</div>
                    <div className="cart-list__col cart-list__col--price">Цена</div>
                    <div className="cart-list__col cart-list__col--qty">Количество</div>
                    <div className="cart-list__col cart-list__col--sum">Сумма</div>
                    <div className="cart-list__col cart-list__col--remove"></div>
                  </div>

                  {items.map((item) => (
                    <div className="cart-list__row" key={item.productId}>
                      <div className="cart-list__col cart-list__col--product">
                        <Link
                          to={`${AppRoute.Shop}/${item.productId}`}
                          className="cart-list__img"
                        >
                          <img
                            src={item.imageUrl || DEFAULT_PRODUCT_IMG}
                            alt={item.title}
                          />
                        </Link>
                        <Link
                          to={`${AppRoute.Shop}/${item.productId}`}
                          className="cart-list__title"
                        >
                          {item.title}
                        </Link>
                      </div>
                      <div className="cart-list__col cart-list__col--price">
                        <span className="cart-list__label d-md-none">Цена:</span>
                        {formatPrice(item.price)}
                      </div>
                      <div className="cart-list__col cart-list__col--qty">
                        <span className="cart-list__label d-md-none">Кол-во:</span>
                        <input
                          type="number"
                          min={1}
                          className="form-control form-control-sm"
                          value={item.quantity}
                          onChange={handleQuantityChange(item.productId)}
                          style={{ width: 80 }}
                        />
                      </div>
                      <div className="cart-list__col cart-list__col--sum">
                        <span className="cart-list__label d-md-none">Сумма:</span>
                        <strong>{formatPrice(item.price * item.quantity)}</strong>
                      </div>
                      <div className="cart-list__col cart-list__col--remove">
                        <button
                          type="button"
                          className="btn-close"
                          onClick={handleRemove(item.productId)}
                          aria-label="Удалить"
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <div className="d-flex justify-content-between align-items-center mt-3 flex-wrap gap-2">
                  <button
                    type="button"
                    className="btn btn-outline-secondary"
                    onClick={handleClear}
                  >
                    Очистить корзину
                  </button>
                  <Link to={AppRoute.Shop} className="btn btn-outline-primary">
                    Продолжить покупки
                  </Link>
                </div>
              </div>

              <div className="col-lg-4">
                <div className="card cart-summary">
                  <div className="card-body">
                    <h4 className="card-title">Итого</h4>
                    <div className="d-flex justify-content-between mb-2">
                      <span className="text-muted">Товаров</span>
                      <span>{cart?.totalItems ?? 0}</span>
                    </div>
                    <div className="d-flex justify-content-between mb-3">
                      <span className="text-muted">Сумма</span>
                      <strong className="cart-summary__total">
                        {formatPrice(cart?.totalPrice ?? 0)}
                      </strong>
                    </div>
                    <button
                      type="button"
                      className="btn btn-primary w-100"
                      onClick={handleCheckout}
                    >
                      Оформить заказ
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default CartPage;
