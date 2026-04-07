import { Route, Routes } from 'react-router-dom';
import { ReactElement } from 'react';

import { AppRoute } from './const';
import LayoutPage from './pages/layout.page';
import MainPage from './pages/main.page';
import ShopPage from './pages/shop.page';
import DownloadsPage from './pages/downloads.page';
import ProductDetailsPage from './pages/product-details.page';
import AboutPage from './pages/about.page';
import PrivateRoute from './components/private-route/private-route';
import LoginPage from './pages/login.page';
import RegisterPage from './pages/register.page';
import ContactsPage from './pages/contacts.page';
import ProfilePage from './pages/profile.page';

export function App(): ReactElement {
  return (
    <Routes>
      <Route path={AppRoute.Main} element={<LayoutPage/>}>
        <Route index element={<MainPage/>}/>
        <Route path={AppRoute.Shop} element={<ShopPage />} />
        <Route path={`${AppRoute.Shop}/:id`} element={<ProductDetailsPage />} />
        <Route path={AppRoute.Downloads} element={
          <PrivateRoute>
            <DownloadsPage />
          </PrivateRoute>
        }/>
        <Route path={AppRoute.About} element={<AboutPage />} />
        <Route path={AppRoute.Contacts} element={<ContactsPage />} />
        <Route path={AppRoute.Login} element={<LoginPage />} />
        <Route path={AppRoute.Register} element={<RegisterPage />} />
        <Route path={AppRoute.Profile} element={<ProfilePage />} />
      </Route>
    </Routes>
  );
}

export default App;
