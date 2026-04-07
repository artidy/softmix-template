import { memo, ReactElement } from 'react';
import { Link } from 'react-router-dom';

function FooterRulesComponent(): ReactElement {
  return (
    <div className="ltn__copyright-area ltn__copyright-2 section-bg-5">
      <div className="container ltn__border-top-2">
        <div className="row">
          <div className="col-md-6 col-12">
            <div className="footer-copyright-left">
              <div className="ltn__copyright-design clearfix">
                <p>&copy; <span className="current-year"></span> - Soft Mix</p>
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
                  <li><Link to="#" title="Facebook"><i className="icon-social-facebook"></i></Link></li>
                  <li><Link to="#" title="Twitter"><i className="icon-social-twitter"></i></Link></li>
                  <li><Link to="#" title="Pinterest"><i className="icon-social-pinterest"></i></Link></li>
                  <li><Link to="#" title="Instagram"><i className="icon-social-instagram"></i></Link></li>
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
