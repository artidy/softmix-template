import {BrowserRouter, Route, Routes} from 'react-router-dom';
import lozad from 'lozad';

import Layout from "../layout";
import {AppRoutes} from "../../const";
import {useEffect} from "react";
import Main from "../../pages/main";
import AboutUs from "../../pages/about-us";

const App = (): JSX.Element => {
  // lib for lazy load elements with selector '.lazy'
  const observer = lozad('.lazy');

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
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
