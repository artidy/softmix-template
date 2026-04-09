import { ReactElement, useEffect, useState } from 'react';
import { Link, Navigate, Outlet, useLocation } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks';
import { getCanManageProducts, getIsAdmin } from '../store/user-data/selectors';
import { getUser } from '../store/user-data/selectors';
import { getSettings } from '../store/settings-data/selectors';
import { getSettingsApi } from '../store/settings-data/api-actions';
import { AppRoute } from '../const';

function AdminLayoutPage(): ReactElement {
  const dispatch = useAppDispatch();
  const user = useAppSelector(getUser);
  const isAdmin = useAppSelector(getIsAdmin);
  const canManageProducts = useAppSelector(getCanManageProducts);
  const settings = useAppSelector(getSettings);
  const location = useLocation();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(getSettingsApi());
  }, []);

  if (!user || !canManageProducts) {
    return <Navigate to={AppRoute.Main} />;
  }

  if (location.pathname === AppRoute.Admin) {
    return <Navigate to={isAdmin ? AppRoute.Users : AppRoute.Import} />;
  }

  const menuItems = [
    ...(isAdmin ? [
      { path: AppRoute.Users, title: 'Пользователи', icon: 'icon-user' },
      { path: AppRoute.Settings, title: 'Настройки сайта', icon: 'icon-settings' },
      { path: AppRoute.Services, title: 'Внешние сервисы', icon: 'icon-globe' },
    ] : []),
    { path: AppRoute.Import, title: 'Импорт товаров', icon: 'icon-cloud-download' },
  ];

  return (
    <div className="admin-layout">
      {/* Admin Header */}
      <header className="admin-header">
        <div className="admin-header__left">
          <Link to={AppRoute.Main} className="admin-header__logo">
            <img src={settings?.logoUrl || 'assets/img/logo.png'} alt="Logo" />
          </Link>
          <div className="admin-header__title">Панель управления</div>
        </div>
        <div className="admin-header__right">
          <span className="admin-header__user">
            <i className="icon-user"></i> {user.name}
          </span>
          <Link to={AppRoute.Main} className="admin-header__link">
            <i className="icon-home"></i> На сайт
          </Link>
        </div>
      </header>

      {/* Mobile toggle */}
      <div className="d-lg-none" style={{ padding: '10px 15px', background: '#1a1a2e' }}>
        <button
          className="theme-btn-1 btn btn-block"
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          style={{ width: '100%' }}
        >
          <i className="icon-menu"></i> {mobileMenuOpen ? 'Скрыть меню' : 'Показать меню'}
        </button>
      </div>

      <div className="admin-layout__body">
        {/* Sidebar */}
        <aside className={`admin-sidebar ${mobileMenuOpen ? '' : 'd-none d-lg-block'}`}>
          <nav className="admin-sidebar__nav">
            {menuItems.map((item) => (
              <Link
                key={item.path}
                className={`admin-sidebar__link${location.pathname === item.path ? ' admin-sidebar__link--active' : ''}`}
                to={item.path}
                onClick={() => setMobileMenuOpen(false)}
              >
                <i className={item.icon}></i>
                <span>{item.title}</span>
              </Link>
            ))}
            <div className="admin-sidebar__divider"></div>
            <Link className="admin-sidebar__link" to={AppRoute.Profile}
              onClick={() => setMobileMenuOpen(false)}
            >
              <i className="icon-logout"></i>
              <span>Назад в профиль</span>
            </Link>
          </nav>
        </aside>

        {/* Content */}
        <main className="admin-content">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default AdminLayoutPage;
