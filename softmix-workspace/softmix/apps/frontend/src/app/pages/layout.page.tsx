import { Outlet, useLocation } from 'react-router-dom';
import { ReactElement, useState } from 'react';

import { useAppSelector } from '../hooks';
import { getIsAdmin, getIsAuth, getIsUnknown } from '../store/user-data/selectors';
import HeaderComponent from '../components/header/header.component';
import LoaderComponent from '../components/loader/loader.component';
import CartMenuComponent from '../components/cart/cart-menu.component';
import FooterAreaComponent from '../components/footer/footer-area.component';
import MenuMobile from '../components/menu-mobile/menu-mobile';

function LayoutPage(): ReactElement {
  const isLoading = useAppSelector(getIsUnknown);
  const routerLocation = useLocation();
  const userIsAdmin = useAppSelector(getIsAdmin);
  const userIsAuth = useAppSelector(getIsAuth);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  if (isLoading) {
    return <LoaderComponent />
  }

  const onToggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  }

  return (
    <div className="body-wrapper">
      <HeaderComponent isOpenMenu={isMobileMenuOpen} onToggleMobileMenu={onToggleMobileMenu}/>
      <MenuMobile userIsAuth={userIsAuth} menuIsOpen={isMobileMenuOpen} onClickClose={onToggleMobileMenu} />
      <Outlet/>
      <FooterAreaComponent />
    </div>
  )
}

export default LayoutPage;
