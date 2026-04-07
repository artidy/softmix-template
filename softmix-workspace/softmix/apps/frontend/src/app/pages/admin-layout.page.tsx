import { ReactElement, useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppSelector } from '../hooks';
import { getCanManageProducts, getIsAdmin } from '../store/user-data/selectors';
import { getUser } from '../store/user-data/selectors';
import { AppRoute } from '../const';
import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';

function AdminLayoutPage(): ReactElement {
  const user = useAppSelector(getUser);
  const isAdmin = useAppSelector(getIsAdmin);
  const canManageProducts = useAppSelector(getCanManageProducts);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  if (!user || !canManageProducts) {
    return <Navigate to={AppRoute.Main} />;
  }

  if (location.pathname === AppRoute.Admin) {
    return <Navigate to={isAdmin ? AppRoute.Users : AppRoute.Main} />;
  }

  const menuItems = [
    ...(isAdmin ? [
      { path: AppRoute.Users, title: 'Пользователи', icon: 'icon-user' },
      { path: AppRoute.Settings, title: 'Настройки сайта', icon: 'icon-settings' },
    ] : []),
  ];

  return (
    <>
      <BreadcrumbComponent
        title="Панель управления"
        links={[{ title: 'Главная', href: AppRoute.Main }]}
        pageName="Панель управления"
      />
      <div className="ltn__myaccount-tab-content-inner pb-65 pt-30">
        <div className="container">
          {/* Mobile toggle */}
          <div className="d-lg-none mb-30">
            <button
              className="theme-btn-1 btn btn-block"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            >
              <i className="icon-menu"></i> {mobileMenuOpen ? 'Скрыть меню' : 'Показать меню'}
            </button>
          </div>

          <div className="row">
            {/* Sidebar */}
            <div className={`col-lg-3 mb-30 ${mobileMenuOpen ? '' : 'd-none d-lg-block'}`}>
              <div className="ltn__tab-menu-list">
                <div className="nav flex-column">
                  {menuItems.map((item) => (
                    <Link
                      key={item.path}
                      className={`nav-link${location.pathname === item.path ? ' active' : ''}`}
                      to={item.path}
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      <i className={item.icon}></i> {item.title}
                    </Link>
                  ))}
                  <Link className="nav-link" to={AppRoute.Profile}
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <i className="icon-logout"></i> Назад в профиль
                  </Link>
                </div>
              </div>
            </div>

            {/* Content */}
            <div className="col-lg-9">
              <div className="ltn__myaccount-tab-content-inner">
                <Outlet />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default AdminLayoutPage;
