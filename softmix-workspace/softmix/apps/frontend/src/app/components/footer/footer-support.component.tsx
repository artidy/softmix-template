import { memo, ReactElement } from 'react';
import { Link } from 'react-router-dom';
import { AppRoute } from '../../const';

function FooterSupportComponent(): ReactElement {
  return (
    <div className="col-xl-2 col-md-6 col-sm-6 col-12">
      <div className="footer-widget footer-menu-widget clearfix">
        <h4 className="footer-title">Поддержка</h4>
        <div className="footer-menu">
          <ul>
            <li><Link to="#">Услуги</Link></li>
            <li><Link to="#">Связаться с нами</Link></li>
            <li><Link to="#">Возврат денег</Link></li>
            <li><Link to={AppRoute.Shop}>Онлайн магазин</Link></li>
            <li><Link to="#">Правила и положения</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default memo(FooterSupportComponent);
