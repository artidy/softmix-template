import {BrowserRouter, Route, Routes} from 'react-router-dom';

import Layout from "../layout";
import {AppRoutes} from "../../const";
import {useEffect} from "react";
import Main from "../../pages/main";
import AboutUs from "../../pages/about-us";
import Contacts from "../../pages/contacts";
import Services from "../../pages/services";
import {observer} from "../../hooks/lozad";
import Products from "../../pages/products";

const App = (): JSX.Element => {

  useEffect(() => {
    observer.observe();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route
          path={AppRoutes.Main}
          element={<Layout />}
        >
          <Route
            path={AppRoutes.Main}
            element={<Main />}
          />
          <Route
            path={AppRoutes.About}
            element={<AboutUs />}
          />
          <Route
            path={AppRoutes.Contacts}
            element={<Contacts />}
          />
          <Route
            path={AppRoutes.Services}
            element={<Services />}
          />
          <Route
            path={AppRoutes.Products}
            element={<Products />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
