import { memo, ReactElement } from 'react';
import { Link } from 'react-router-dom';

function FooterLinksComponent(): ReactElement {
  return (
    <div className="col-xl-2 col-md-6 col-sm-6 col-12">
      <div className="footer-widget footer-menu-widget clearfix">
        <h4 className="footer-title">Быстрые ссылки</h4>
        <div className="footer-menu">
          <ul>
            <li><Link to="#">Местоположение</Link></li>
            <li><Link to="#">Отслеживание заказа</Link></li>
            <li><Link to="#">Сравнение товаров</Link></li>
            <li><Link to="#">Аккаунт</Link></li>
            <li><Link to="#">Частые вопросы</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default memo(FooterLinksComponent);
