import { memo, MouseEvent, MouseEventHandler, ReactElement, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { debounce } from 'lodash';

import './header.css';

import { AppRoute } from '../../const';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { getIsAuth } from '../../store/user-data/selectors';
import { getSettings } from '../../store/settings-data/selectors';
import LogoComponent from '../logo/logo.component';
import SearchPanelComponent from '../search/search-panel.component';
import BtnMobileComponent from '../btn-mobile/btn-mobile.component';
import MenuComponent from '../menu/menu.component';
import BtnAuthComponent from '../btn-auth/btn-auth.component';

type HeaderComponentProps = {
  isOpenMenu: boolean;
  onToggleMobileMenu: MouseEventHandler;
}

function HeaderComponent({isOpenMenu, onToggleMobileMenu}: HeaderComponentProps): ReactElement {
  const userIsAuth = useAppSelector(getIsAuth);
  const settings = useAppSelector(getSettings);
  const [currentHeight, setCurrentHeight] = useState(0);
  const startStickyHeight = 250;

  const onActivateStickyHeader = () => {
    setCurrentHeight(window.scrollY);
  }

  useEffect(() => {
    document.addEventListener('scroll', debounce(onActivateStickyHeader, 50));

    return () => { document.removeEventListener('scroll', onActivateStickyHeader)};
  }, []);

  return (
    <header className="ltn__header-area ltn__header-3 section-bg-6">
      <div className="ltn__header-middle-area d-none d-xl-block">
        <div className="container">
          <div className="row">
            <div className="col-3">
              <LogoComponent
                className="site-logo"
                href={AppRoute.Main}
                src={settings?.logoUrl || 'assets/img/logo.png'}
                alt="Logo"
              />
            </div>
            <div className="col-9 header-contact-serarch-column">
              <div className="header-contact-search">
                <div className="header-feature-item">
                  <div className="header-feature-icon">
                    <i className="icon-phone"></i>
                  </div>
                  <div className="header-feature-info">
                    <h6>Тел.</h6>
                    <p><a href={`tel:${settings?.phone?.replace(/[^0-9+]/g, '') || ''}`}>{settings?.phone || ''}</a></p>
                  </div>
                </div>
                <SearchPanelComponent className="header-search-2"/>
                <BtnAuthComponent userIsAuth={userIsAuth}/>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`header-bottom-area ltn__border-top ltn__header-sticky ltn__sticky-bg-white
        ltn__primary-bg---- menu-color-white---- d-none d-lg-block${currentHeight > startStickyHeight ? ' sticky-active' : ''}`}>
        <div className="container">
          <div className="row">
            <div className="col header-menu-column justify-content-center">
              <div className="sticky-logo">
                <LogoComponent
                  className="site-logo"
                  href={AppRoute.Main}
                  src={settings?.logoUrl || 'assets/img/logo.png'}
                  alt="Logo"
                />
              </div>
              <SearchPanelComponent className="header-search-2 sticky-logo"/>
              <div className="header-menu header-menu-2">
                <nav>
                  <div className="ltn__main-menu">
                    <MenuComponent userIsAuth={userIsAuth}/>
                  </div>
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className={`ltn__header-middle-area d-lg-none${currentHeight > startStickyHeight ? ' sticky-active' : ''}`}>
        <div className="container">
          <div className="row">
            <div className="col-3">
              <LogoComponent
                className="site-logo"
                href={AppRoute.Main}
                src={settings?.logoUrl || 'assets/img/logo.png'}
                alt="Logo"
              />
            </div>
            <BtnMobileComponent userIsAuth={userIsAuth} onClickToggle={onToggleMobileMenu}/>
            <SearchPanelComponent className="col-12 header-search-2"/>
          </div>
        </div>
      </div>
    </header>
  )
}

export default memo(HeaderComponent);
