import {Outlet} from "react-router-dom";

import Footer from "../footer";
import HeaderComponent from '../header';
import PopupSideComponent from '../popup-side';
import LoginFormComponent from '../login-form';
import {useEffect, useState} from 'react';

const Layout = (): JSX.Element => {
  const [isLogin, setIsLogin] = useState(false);
  const clientWidth = document.body.clientWidth;

  useEffect(() => {
    document.body.style.overflow = isLogin ? 'hidden' : '';
    document.body.style.paddingRight = isLogin ? `${document.body.clientWidth - clientWidth}px` : '';
  }, [isLogin])

  return (
    <>
      <main className="main main-visible">
        <div className="main-inner">
          <HeaderComponent setIsLogin={setIsLogin} />
          <PopupSideComponent
            additionalClass='side-account'
            isOpen={isLogin}
            toggleOpen={setIsLogin}
          >
            <LoginFormComponent />
          </PopupSideComponent>
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Layout;
