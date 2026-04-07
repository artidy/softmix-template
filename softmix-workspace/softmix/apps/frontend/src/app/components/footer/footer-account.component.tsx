import { memo, ReactElement } from 'react';
import { Link } from 'react-router-dom';

function FooterAccountComponent(): ReactElement {
  return (
    <div className="col-xl-2 col-md-6 col-sm-6 col-12">
      <div className="footer-widget footer-menu-widget clearfix">
        <h4 className="footer-title">Аккаунт</h4>
        <div className="footer-menu">
          <ul>
            <li><Link to="#">Профиль</Link></li>
            <li><Link to="#">Заказы</Link></li>
            <li><Link to="#">Контакты</Link></li>
            <li><Link to="#">Корзина</Link></li>
            <li><Link to="#">Избранное</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default memo(FooterAccountComponent);
