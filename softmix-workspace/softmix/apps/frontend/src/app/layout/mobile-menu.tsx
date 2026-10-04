import { Link, NavLink } from 'react-router';
import { LayoutDashboard, LogIn, Mail, Package, Phone, UserPlus, UserRound } from 'lucide-react';

import { AppRoute } from '../const';
import { cn } from '../lib/cn';
import { useAppSelector } from '../hooks';
import { getCanManageProducts, getIsAuth } from '../store/user-data/selectors';
import { getSettings } from '../store/settings-data/selectors';
import { Dialog, SheetContent } from '../ui/dialog';
import { ThemeToggle } from '../ui/theme-toggle';
import { MAIN_NAV, phoneHref } from './nav';
import { SearchForm } from './search-form';

type MobileMenuProps = {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  focusSearch?: boolean;
};

const LINK =
  'flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm font-medium transition-colors hover:bg-accent [&_svg]:size-4 [&_svg]:text-muted-foreground';

export function MobileMenu({ open, onOpenChange, focusSearch = false }: MobileMenuProps) {
  const isAuth = useAppSelector(getIsAuth);
  const canManage = useAppSelector(getCanManageProducts);
  const settings = useAppSelector(getSettings);
  const close = () => onOpenChange(false);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <SheetContent title="Меню" side="left">
        <div className="grid gap-6 p-5">
          <SearchForm autoFocus={focusSearch} onSearch={close} />

          <nav className="grid gap-1" aria-label="Основное меню">
            {MAIN_NAV.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.end}
                onClick={close}
                className={({ isActive }) =>
                  cn(
                    'rounded-lg px-3 py-2.5 text-base font-medium transition-colors hover:bg-accent',
                    isActive && 'bg-accent text-primary',
                  )
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>

          <div className="grid gap-1 border-t pt-5">
            {isAuth ? (
              <>
                <Link to={AppRoute.Profile} onClick={close} className={LINK}>
                  <UserRound />
                  Профиль
                </Link>
                <Link to={AppRoute.Orders} onClick={close} className={LINK}>
                  <Package />
                  Мои заказы
                </Link>
                {canManage && (
                  <Link to={AppRoute.Admin} onClick={close} className={LINK}>
                    <LayoutDashboard />
                    Панель управления
                  </Link>
                )}
              </>
            ) : (
              <>
                <Link to={AppRoute.Login} onClick={close} className={LINK}>
                  <LogIn />
                  Войти
                </Link>
                <Link to={AppRoute.Register} onClick={close} className={LINK}>
                  <UserPlus />
                  Регистрация
                </Link>
              </>
            )}
          </div>

          {(settings?.phone || settings?.email) && (
            <div className="grid gap-1 border-t pt-5">
              {settings?.phone && (
                <a href={phoneHref(settings.phone)} className={LINK}>
                  <Phone />
                  {settings.phone}
                </a>
              )}
              {settings?.email && (
                <a href={`mailto:${settings.email}`} className={LINK}>
                  <Mail />
                  {settings.email}
                </a>
              )}
            </div>
          )}

          <div className="flex items-center justify-between border-t pt-5 text-sm text-muted-foreground">
            Тема оформления
            <ThemeToggle />
          </div>
        </div>
      </SheetContent>
    </Dialog>
  );
}
