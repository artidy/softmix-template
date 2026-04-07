import { memo, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { useAppSelector } from '../../hooks';
import { getSettings } from '../../store/settings-data/selectors';

function FooterRulesComponent(): ReactElement {
  const settings = useAppSelector(getSettings);

  return (
    <div className="ltn__copyright-area ltn__copyright-2 section-bg-5">
      <div className="container ltn__border-top-2">
        <div className="row">
          <div className="col-md-6 col-12">
            <div className="footer-copyright-left">
              <div className="ltn__copyright-design clearfix">
                <p>&copy; <span className="current-year"></span> - {settings?.copyright || 'Soft Mix'}</p>
              </div>
            </div>
          </div>
          <div className="col-md-6 col-12 align-self-center">
            <div className="footer-copyright-right text-right">
              <div className="ltn__copyright-menu d-none">
                <ul>
                  <li><Link to="#">Правила и положения</Link></li>
                  <li><Link to="#">Правила возврата</Link></li>
                  <li><Link to="#">Политика конфидициальности</Link></li>
                </ul>
              </div>
              <div className="ltn__social-media ">
                <ul>
                  {settings?.socialFacebook ? <li><a href={settings.socialFacebook} target="_blank" rel="noreferrer" title="Facebook"><i className="icon-social-facebook"></i></a></li> : null}
                  {settings?.socialTwitter ? <li><a href={settings.socialTwitter} target="_blank" rel="noreferrer" title="Twitter"><i className="icon-social-twitter"></i></a></li> : null}
                  {settings?.socialPinterest ? <li><a href={settings.socialPinterest} target="_blank" rel="noreferrer" title="Pinterest"><i className="icon-social-pinterest"></i></a></li> : null}
                  {settings?.socialInstagram ? <li><a href={settings.socialInstagram} target="_blank" rel="noreferrer" title="Instagram"><i className="icon-social-instagram"></i></a></li> : null}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(FooterRulesComponent);
