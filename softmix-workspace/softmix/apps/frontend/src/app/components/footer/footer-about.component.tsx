import { memo, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { AppRoute } from '../../const';
import { useAppSelector } from '../../hooks';
import { getSettings } from '../../store/settings-data/selectors';
import LogoComponent from '../logo/logo.component';

function FooterAboutComponent(): ReactElement {
  const settings = useAppSelector(getSettings);

  return (
    <div className="col-xl-4 col-md-6 col-sm-6 col-12">
      <div className="footer-widget footer-about-widget">
        <h4 className="footer-title">О нашей компании</h4>
        <div className="footer-logo d-none">
          <LogoComponent
            className="site-logo"
            href={AppRoute.Main}
            src={settings?.logoUrl || 'assets/img/logo.png'}
            alt="Logo"
          />
        </div>
        <p>{settings?.companyDescription || ''}</p>
        <div className="footer-address">
          <ul>
            <li>
              <div className="footer-address-icon">
                <i className="icon-location-pin"></i>
              </div>
              <div className="footer-address-info">
                <p>{settings?.address || ''}</p>
              </div>
            </li>
            <li>
              <div className="footer-address-icon">
                <i className="icon-phone"></i>
              </div>
              <div className="footer-address-info">
                <p><a href={`tel:${settings?.phone?.replace(/[^0-9+]/g, '') || ''}`}>{settings?.phone || ''}</a></p>
              </div>
            </li>
            <li>
              <div className="footer-address-icon">
                <i className="icon-envelope"></i>
              </div>
              <div className="footer-address-info">
                <p><a href={`mailto:${settings?.email || ''}`}>{settings?.email || ''}</a></p>
              </div>
            </li>
          </ul>
        </div>
        <div className="ltn__social-media mt-20">
          <ul>
            {settings?.socialFacebook ? <li><a href={settings.socialFacebook} target="_blank" rel="noreferrer" title="Facebook"><i className="fab fa-facebook-f"></i></a></li> : null}
            {settings?.socialTwitter ? <li><a href={settings.socialTwitter} target="_blank" rel="noreferrer" title="Twitter"><i className="fab fa-twitter"></i></a></li> : null}
            {settings?.socialInstagram ? <li><a href={settings.socialInstagram} target="_blank" rel="noreferrer" title="Instagram"><i className="fab fa-instagram"></i></a></li> : null}
            {settings?.socialPinterest ? <li><a href={settings.socialPinterest} target="_blank" rel="noreferrer" title="Pinterest"><i className="fab fa-pinterest"></i></a></li> : null}
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
