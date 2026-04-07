import { memo, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { AppRoute } from '../../const';
import LogoComponent from '../logo/logo.component';
import EmailComponent from '../email/email.component';

function FooterAboutComponent(): ReactElement {
  return (
    <div className="col-xl-4 col-md-6 col-sm-6 col-12">
      <div className="footer-widget footer-about-widget">
        <h4 className="footer-title">О нашей компании</h4>
        <div className="footer-logo d-none">
          <LogoComponent
            className="site-logo"
            href={AppRoute.Main}
            src="assets/img/logo.png"
            alt="Logo"
          />
        </div>
        <p>Товарищество с ограниченной ответственностью «Soft Mix» образовано 9 октября 2013 года
          командой профессионалов в области Вычислительной техники,
          программного обеспечения и проектирования.</p>
        <div className="footer-address">
          <ul>
            <li>
              <div className="footer-address-icon">
                <i className="icon-location-pin"></i>
              </div>
              <div className="footer-address-info">
                <p>Астана, ул. Достык 20 БЦ "Санкт-Петербург" офис 401</p>
              </div>
            </li>
            <li>
              <div className="footer-address-icon">
                <i className="icon-phone"></i>
              </div>
              <div className="footer-address-info">
                <p><a href="tel:787206">78-72-06</a></p>
              </div>
            </li>
            <li>
              <div className="footer-address-icon">
                <i className="icon-envelope"></i>
              </div>
              <div className="footer-address-info">
                <p><EmailComponent /></p>
              </div>
            </li>
          </ul>
        </div>
        <div className="ltn__social-media mt-20 d-none">
          <ul>
            <li><Link to="#" title="Facebook"><i className="fab fa-facebook-f"></i></Link></li>
            <li><Link to="#" title="Twitter"><i className="fab fa-twitter"></i></Link></li>
            <li><Link to="#" title="Linkedin"><i className="fab fa-linkedin"></i></Link></li>
            <li><Link to="#" title="Youtube"><i className="fab fa-youtube"></i></Link></li>
          </ul>
        </div>
        <div className="footer-payment-img">
          <img src="assets/img/icons/payment-6.png" alt="Payment Image" />
        </div>
      </div>
    </div>
  )
}

export default memo(FooterAboutComponent);
