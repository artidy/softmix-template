import { memo, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import CartItemComponent from './cart-item.component';

function CartMenuComponent(): ReactElement {
  const cartItems = [
    {
      id: 'JKHkjh2312k3',
      imgUrl: 'assets/img/product/1.png',
      title: 'Лицензия 1С',
      price: 13000,
      count: 2,
    },
    {
      id: 'LKlkjsdjqwk2',
      imgUrl: 'assets/img/product/2.png',
      title: 'Установка 1С',
      price: 3500,
      count: 1,
    }
  ];

  const cartItemsContent = cartItems.map((cartItem) =>
    <CartItemComponent
      key={cartItem.id}
      id={cartItem.id}
      imgUrl={cartItem.imgUrl}
      title={cartItem.title}
      price={cartItem.price}
      count={cartItem.count}
    />
  );

  return (
    <div id="ltn__utilize-cart-menu" className="ltn__utilize ltn__utilize-cart-menu">
      <div className="ltn__utilize-menu-inner ltn__scrollbar">
        <div className="ltn__utilize-menu-head">
          <span className="ltn__utilize-menu-title">Корзина</span>
          <button className="ltn__utilize-close">×</button>
        </div>
        <div className="mini-cart-product-area ltn__scrollbar">
          {cartItemsContent}
        </div>
        <div className="mini-cart-footer">
          <div className="mini-cart-sub-total">
            <h5>Всего: <span>29 500 тг</span></h5>
          </div>
          <div className="btn-wrapper">
            <Link to="#" className="theme-btn-1 btn btn-effect-1">Подробнее</Link>
            <Link to="#" className="theme-btn-2 btn btn-effect-2">Оплатить</Link>
          </div>
          <p>Бесплатная доставка от 50 000 тг</p>
        </div>
      </div>
    </div>
  )
}

export default memo(CartMenuComponent);
