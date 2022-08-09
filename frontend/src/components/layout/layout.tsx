import {Outlet} from "react-router-dom";

import Footer from "../footer";
import HeaderComponent from '../header';

const Layout = (): JSX.Element => {
  return (
    <>
      <main className="main main-visible">
        <div className="main-inner">
          <HeaderComponent />
          <Outlet />
        </div>
      </main>
      <Footer />
    </>
  )
}

export default Layout;
