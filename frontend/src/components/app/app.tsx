import {BrowserRouter, Route, Routes} from 'react-router-dom';
import lozad from 'lozad';

import Layout from "../layout";
import IntroGrid from "../intro-grid";
import {AppRoutes} from "../../const";
import {useEffect} from "react";
import Advantages from "../advantages";

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
            element={<IntroGrid />}
          />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}

export default App;
