import { lazy, Suspense } from 'react';
import { Navigate, Route, Routes } from 'react-router';

import { AppRoute } from './const';
import LayoutPage from './pages/layout.page';
import MainPage from './pages/main.page';
import PrivateRoute from './components/private-route/private-route';
import AdminRoute from './components/private-route/admin-route';
import StaffRoute from './components/private-route/staff-route';
import { PageLoader } from './ui/feedback';

// Главная грузится сразу, остальные страницы — отдельными файлами при первом переходе.
const ShopPage = lazy(() => import('./pages/shop.page'));
const ProductDetailsPage = lazy(() => import('./pages/product-details.page'));
const AboutPage = lazy(() => import('./pages/about.page'));
const ContactsPage = lazy(() => import('./pages/contacts.page'));
const LoginPage = lazy(() => import('./pages/login.page'));
const RegisterPage = lazy(() => import('./pages/register.page'));
const VerifyEmailPage = lazy(() => import('./pages/verify-email.page'));
const ProfilePage = lazy(() => import('./pages/profile.page'));
const CartPage = lazy(() => import('./pages/cart.page'));
const CheckoutPage = lazy(() => import('./pages/checkout.page'));
const CheckoutSuccessPage = lazy(() => import('./pages/checkout-success.page'));
const PaymentSuccessPage = lazy(() => import('./pages/payment-success.page'));
const PaymentFailedPage = lazy(() => import('./pages/payment-failed.page'));
const MyOrdersPage = lazy(() => import('./pages/my-orders.page'));
const OrderDetailsPage = lazy(() => import('./pages/order-details.page'));
const AdminLayoutPage = lazy(() => import('./pages/admin-layout.page'));
const AdminOrdersPage = lazy(() => import('./pages/admin-orders.page'));
const AdminOrderDetailsPage = lazy(() => import('./pages/admin-order-details.page'));
const AdminPaymentSettingsPage = lazy(() => import('./pages/admin-payment-settings.page'));
const AdminMailSettingsPage = lazy(() => import('./pages/admin-mail-settings.page'));
const UsersPage = lazy(() => import('./pages/users.page'));
const SettingsPage = lazy(() => import('./pages/settings.page'));
const ExternalServicesPage = lazy(() => import('./pages/external-services.page'));
const ImportPage = lazy(() => import('./pages/import.page'));
const NotFoundPage = lazy(() => import('./pages/not-found.page'));

export function App() {
  return (
    <Suspense fallback={<PageLoader />}>
      <Routes>
        <Route path={AppRoute.Main} element={<LayoutPage />}>
          <Route index element={<MainPage />} />
          <Route path={AppRoute.Shop} element={<ShopPage />} />
          <Route path={`${AppRoute.Shop}/:id`} element={<ProductDetailsPage />} />
          {/* Старая страница загрузки из Al-Style: теперь это «Импорт товаров» в панели управления. */}
          <Route path={AppRoute.Downloads} element={<Navigate to={AppRoute.Import} replace />} />
          <Route path={AppRoute.About} element={<AboutPage />} />
          <Route path={AppRoute.Contacts} element={<ContactsPage />} />
          <Route path={AppRoute.Login} element={<LoginPage />} />
          <Route path={AppRoute.Register} element={<RegisterPage />} />
          <Route path={AppRoute.VerifyEmail} element={<VerifyEmailPage />} />
          <Route
            path={AppRoute.Profile}
            element={
              <PrivateRoute>
                <ProfilePage />
              </PrivateRoute>
            }
          />
          <Route path={AppRoute.Cart} element={<CartPage />} />
          <Route path={AppRoute.Checkout} element={<CheckoutPage />} />
          <Route
            path={AppRoute.CheckoutSuccess}
            element={
              <PrivateRoute>
                <CheckoutSuccessPage />
              </PrivateRoute>
            }
          />
          <Route
            path={AppRoute.PaymentSuccess}
            element={
              <PrivateRoute>
                <PaymentSuccessPage />
              </PrivateRoute>
            }
          />
          <Route
            path={AppRoute.PaymentFailed}
            element={
              <PrivateRoute>
                <PaymentFailedPage />
              </PrivateRoute>
            }
          />
          <Route
            path={AppRoute.Orders}
            element={
              <PrivateRoute>
                <MyOrdersPage />
              </PrivateRoute>
            }
          />
          <Route
            path={AppRoute.OrderDetails}
            element={
              <PrivateRoute>
                <OrderDetailsPage />
              </PrivateRoute>
            }
          />
          <Route path="*" element={<NotFoundPage />} />
        </Route>
        <Route
          path={AppRoute.Admin}
          element={
            <PrivateRoute>
              <AdminLayoutPage />
            </PrivateRoute>
          }
        >
          <Route path={AppRoute.Users} element={<AdminRoute><UsersPage /></AdminRoute>} />
          <Route path={AppRoute.Settings} element={<AdminRoute><SettingsPage /></AdminRoute>} />
          <Route path={AppRoute.Services} element={<AdminRoute><ExternalServicesPage /></AdminRoute>} />
          <Route path={AppRoute.AdminOrders} element={<StaffRoute><AdminOrdersPage /></StaffRoute>} />
          <Route path={AppRoute.AdminOrderDetails} element={<StaffRoute><AdminOrderDetailsPage /></StaffRoute>} />
          <Route path={AppRoute.AdminPaymentSettings} element={<AdminRoute><AdminPaymentSettingsPage /></AdminRoute>} />
          <Route path={AppRoute.AdminMailSettings} element={<AdminRoute><AdminMailSettingsPage /></AdminRoute>} />
          <Route path={AppRoute.Import} element={<ImportPage />} />
          {/* Неизвестный раздел панели — на её стартовую страницу. */}
          <Route path="*" element={<Navigate to={AppRoute.Admin} replace />} />
        </Route>
      </Routes>
    </Suspense>
  );
}

export default App;
