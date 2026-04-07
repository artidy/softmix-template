import { memo, ReactElement } from 'react';
import { Link } from 'react-router-dom';

function FooterInformationComponent(): ReactElement {
  return (
    <div className="col-xl-2 col-md-6 col-sm-6 col-12">
      <div className="footer-widget footer-menu-widget clearfix">
        <h4 className="footer-title">Информация</h4>
        <div className="footer-menu">
          <ul>
            <li><Link to="#">Контакты</Link></li>
            <li><Link to="#">О нас</Link></li>
            <li><Link to="#">Вакансии</Link></li>
            <li><Link to="#">Информация о доставке</Link></li>
            <li><Link to="#">Правила и положения</Link></li>
          </ul>
        </div>
      </div>
    </div>
  )
}

export default memo(FooterInformationComponent);
