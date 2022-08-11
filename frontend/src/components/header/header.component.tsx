import HeaderTopInfo from '../header-top-info';
import SocialLinks from '../social-links';
import FixedHeaderComponent from './fixed-header';

type HeaderComponentProps = {
  setIsLogin: Function;
}

const HeaderComponent = ({setIsLogin}: HeaderComponentProps): JSX.Element => {
  return (
    <header className="header">
      <nav className="header-top">
        <div className="container">
          <div className="row align-items-center justify-content-between">
            <div className="col-auto">
              <HeaderTopInfo />
            </div>
            <div className="col-auto">
              <div className="header-top-links">
                <SocialLinks className="social-links" />
                <div className="header-top-btn">
                  <a href="#сallback_popup" className="header-call-back-link сallback_popup_open">
                    <i className="material-icons">ring_volume</i>
                    <span>Callback</span>
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </nav>
      <FixedHeaderComponent setIsLogin={setIsLogin} />
    </header>
  )
};

export default HeaderComponent;
