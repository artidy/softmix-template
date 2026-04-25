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
import AdminRoute from './components/private-route/admin-route';
import StaffRoute from './components/private-route/staff-route';
import LoginPage from './pages/login.page';
import RegisterPage from './pages/register.page';
import VerifyEmailPage from './pages/verify-email.page';
import ContactsPage from './pages/contacts.page';
import ProfilePage from './pages/profile.page';
import CartPage from './pages/cart.page';
import CheckoutPage from './pages/checkout.page';
import CheckoutSuccessPage from './pages/checkout-success.page';
import PaymentSuccessPage from './pages/payment-success.page';
import PaymentFailedPage from './pages/payment-failed.page';
import MyOrdersPage from './pages/my-orders.page';
import OrderDetailsPage from './pages/order-details.page';
import AdminOrdersPage from './pages/admin-orders.page';
import AdminOrderDetailsPage from './pages/admin-order-details.page';
import AdminPaymentSettingsPage from './pages/admin-payment-settings.page';
import AdminMailSettingsPage from './pages/admin-mail-settings.page';
import UsersPage from './pages/users.page';
import SettingsPage from './pages/settings.page';
import ExternalServicesPage from './pages/external-services.page';
import ImportPage from './pages/import.page';
import AdminLayoutPage from './pages/admin-layout.page';

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
        <Route path={AppRoute.VerifyEmail} element={<VerifyEmailPage />} />
        <Route path={AppRoute.Profile} element={<ProfilePage />} />
        <Route path={AppRoute.Cart} element={<CartPage />} />
        <Route path={AppRoute.Checkout} element={<CheckoutPage />} />
        <Route path={AppRoute.CheckoutSuccess} element={
          <PrivateRoute>
            <CheckoutSuccessPage />
          </PrivateRoute>
        } />
        <Route path={AppRoute.PaymentSuccess} element={
          <PrivateRoute>
            <PaymentSuccessPage />
          </PrivateRoute>
        } />
        <Route path={AppRoute.PaymentFailed} element={
          <PrivateRoute>
            <PaymentFailedPage />
          </PrivateRoute>
        } />
        <Route path={AppRoute.Orders} element={
          <PrivateRoute>
            <MyOrdersPage />
          </PrivateRoute>
        } />
        <Route path={AppRoute.OrderDetails} element={
          <PrivateRoute>
            <OrderDetailsPage />
          </PrivateRoute>
        } />
      </Route>
      <Route path={AppRoute.Admin} element={
        <PrivateRoute>
          <AdminLayoutPage />
        </PrivateRoute>
      }>
        <Route path={AppRoute.Users} element={<AdminRoute><UsersPage /></AdminRoute>} />
        <Route path={AppRoute.Settings} element={<AdminRoute><SettingsPage /></AdminRoute>} />
        <Route path={AppRoute.Services} element={<AdminRoute><ExternalServicesPage /></AdminRoute>} />
        <Route path={AppRoute.AdminOrders} element={<StaffRoute><AdminOrdersPage /></StaffRoute>} />
        <Route path={AppRoute.AdminOrderDetails} element={<StaffRoute><AdminOrderDetailsPage /></StaffRoute>} />
        <Route path={AppRoute.AdminPaymentSettings} element={<AdminRoute><AdminPaymentSettingsPage /></AdminRoute>} />
        <Route path={AppRoute.AdminMailSettings} element={<AdminRoute><AdminMailSettingsPage /></AdminRoute>} />
        <Route path={AppRoute.Import} element={<ImportPage />} />
      </Route>
    </Routes>
  );
}

export default App;
