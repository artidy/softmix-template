import { Suspense, useEffect, useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router';

import { useAppDispatch } from '../hooks';
import { getSettingsApi } from '../store/settings-data/api-actions';
import { SiteHeader } from '../layout/site-header';
import { SiteFooter } from '../layout/site-footer';
import { PageLoader } from '../ui/feedback';

/**
 * Новая страница открывается сверху. Layout-эффект срабатывает до отрисовки —
 * иначе страница на миг показывается с прокруткой предыдущей и потом прыгает.
 */
function useScrollToTopOnNavigate(pathname: string): void {
  useLayoutEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);
}

function LayoutPage() {
  const dispatch = useAppDispatch();
  const { pathname } = useLocation();

  useScrollToTopOnNavigate(pathname);

  useEffect(() => {
    dispatch(getSettingsApi());
  }, [dispatch]);

  return (
    <div className="flex min-h-dvh flex-col">
      <a
        href="#main"
        className="sr-only z-50 rounded-lg bg-primary px-4 py-2 text-primary-foreground focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Перейти к содержимому
      </a>
      <SiteHeader />
      <main id="main" className="flex-1">
        {/* Страница грузится отдельным файлом — шапка и подвал при этом остаются на месте.
            Переход между адресами плавный: новая страница мягко проявляется. */}
        <Suspense fallback={<PageLoader />}>
          <div key={pathname} className="animate-page-in">
            <Outlet />
          </div>
        </Suspense>
      </main>
      <SiteFooter />
    </div>
  );
}

export default LayoutPage;
