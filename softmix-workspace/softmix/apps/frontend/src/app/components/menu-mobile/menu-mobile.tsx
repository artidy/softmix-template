import { memo, MouseEventHandler, ReactElement } from 'react';

import MenuComponent from '../menu/menu.component';
import { AppRoute } from '../../const';
import LogoComponent from '../logo/logo.component';

type MenuMobileProps = {
  userIsAuth: boolean;
  menuIsOpen: boolean;
  onClickClose: MouseEventHandler;
}

function MenuMobile({userIsAuth, menuIsOpen, onClickClose}: MenuMobileProps): ReactElement {
  return (
    <div
      id="ltn__utilize-mobile-menu"
      className={`ltn__utilize ltn__utilize-mobile-menu${ menuIsOpen ? 'ltn__utilize-open' : ''}`}
    >
      <div className="ltn__utilize-menu-inner ltn__scrollbar">
        <div className="ltn__utilize-menu-head">
          <LogoComponent
            className="site-logo"
            href={AppRoute.Main}
            src="assets/img/logo.png"
            alt="Logo"
          />
          <button className="ltn__utilize-close" onClick={onClickClose}>×</button>
        </div>
        <div className="ltn__utilize-menu">
          <MenuComponent userIsAuth={userIsAuth} />
        </div>
      </div>
    </div>
  )
}

export default memo(MenuMobile);
