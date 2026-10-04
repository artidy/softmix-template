import { Suspense, useEffect, useState } from 'react';
import { Link, Navigate, NavLink, Outlet, useLocation } from 'react-router';
import {
  CloudDownload,
  CreditCard,
  ExternalLink,
  Mail,
  Menu,
  PlugZap,
  Settings,
  ShoppingBag,
  UserRound,
  Users,
  LucideIcon,
} from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../hooks';
import { getCanManageProducts, getIsAdmin, getUser } from '../store/user-data/selectors';
import { getSettingsApi } from '../store/settings-data/api-actions';
import { AppRoute } from '../const';
import { cn } from '../lib/cn';
import { getInitials } from '../lib/format';
import { Button } from '../ui/button';
import { Dialog, SheetContent } from '../ui/dialog';
import { PageLoader } from '../ui/feedback';
import { Logo } from '../ui/logo';
import { ThemeToggle } from '../ui/theme-toggle';

type NavItem = { to: string; label: string; Icon: LucideIcon };
type NavGroup = { title: string; items: NavItem[] };

function SidebarNav({ groups, onNavigate }: { groups: NavGroup[]; onNavigate?: () => void }) {
  return (
    <nav aria-label="Разделы панели управления" className="grid gap-6">
      {groups.map((group) => (
        <div key={group.title}>
          <p className="mb-2 px-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{group.title}</p>
          <ul className="grid gap-0.5">
            {group.items.map(({ to, label, Icon }) => (
              <li key={to}>
                <NavLink
                  to={to}
                  onClick={onNavigate}
                  className={({ isActive }) =>
                    cn(
                      'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors',
                      isActive ? 'bg-primary-soft text-primary' : 'text-muted-foreground hover:bg-accent hover:text-foreground',
                    )
                  }
                >
                  <Icon className="size-4 shrink-0" aria-hidden="true" />
                  {label}
                </NavLink>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </nav>
  );
}

function SidebarFooter({ onNavigate }: { onNavigate?: () => void }) {
  const link = 'flex items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-accent hover:text-foreground';

  return (
    <div className="grid gap-0.5 border-t pt-4">
      <Link to={AppRoute.Main} onClick={onNavigate} className={link}>
        <ExternalLink className="size-4" aria-hidden="true" />
        На сайт
      </Link>
      <Link to={AppRoute.Profile} onClick={onNavigate} className={link}>
        <UserRound className="size-4" aria-hidden="true" />
        Профиль
      </Link>
    </div>
  );
}

function AdminLayoutPage() {
  const dispatch = useAppDispatch();
  const location = useLocation();
  const user = useAppSelector(getUser);
  const isAdmin = useAppSelector(getIsAdmin);
  const canManageProducts = useAppSelector(getCanManageProducts);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    dispatch(getSettingsApi());
  }, [dispatch]);

  if (!user || !canManageProducts) {
    return <Navigate to={AppRoute.Main} />;
  }

  if (location.pathname === AppRoute.Admin) {
    return <Navigate to={isAdmin ? AppRoute.Users : AppRoute.Import} replace />;
  }

  const groups: NavGroup[] = [
    {
      title: 'Магазин',
      items: [
        { to: AppRoute.AdminOrders, label: 'Заказы', Icon: ShoppingBag },
        { to: AppRoute.Import, label: 'Импорт товаров', Icon: CloudDownload },
      ],
    },
    ...(isAdmin
      ? [
          {
            title: 'Администрирование',
            items: [
              { to: AppRoute.Users, label: 'Пользователи', Icon: Users },
              { to: AppRoute.Settings, label: 'Настройки сайта', Icon: Settings },
              { to: AppRoute.Services, label: 'Внешние сервисы', Icon: PlugZap },
              { to: AppRoute.AdminPaymentSettings, label: 'Платёжные системы', Icon: CreditCard },
              { to: AppRoute.AdminMailSettings, label: 'Настройки почты', Icon: Mail },
            ],
          },
        ]
      : []),
  ];

  const closeMenu = () => setIsMenuOpen(false);

  return (
    <div className="min-h-dvh bg-muted/40 lg:grid lg:grid-cols-[16rem_minmax(0,1fr)]">
      <aside className="hidden border-r bg-card lg:block">
        <div className="sticky top-0 flex h-dvh flex-col gap-6 overflow-y-auto p-4">
          <Link to={AppRoute.Main} className="flex items-center gap-3 px-2 pt-1" aria-label="Soft Mix — на сайт">
            <Logo className="h-10" />
          </Link>
          <div className="flex-1">
            <SidebarNav groups={groups} />
          </div>
          <SidebarFooter />
        </div>
      </aside>

      <div className="flex min-w-0 flex-col">
        <header className="sticky top-0 z-30 flex h-16 items-center gap-3 border-b bg-background/80 px-4 backdrop-blur-xl sm:px-6 lg:px-8">
          <Button variant="ghost" size="icon" className="lg:hidden" onClick={() => setIsMenuOpen(true)} aria-label="Открыть меню">
            <Menu />
          </Button>
          <p className="font-semibold">Панель управления</p>
          <div className="ml-auto flex items-center gap-2">
            <ThemeToggle />
            <span className="hidden text-sm text-muted-foreground sm:inline">{user.name || user.login}</span>
            <span className="grid size-9 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary" aria-hidden="true">
              {getInitials(user.name || user.login) || <UserRound className="size-4" />}
            </span>
          </div>
        </header>

        <main className="flex-1 px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
          <Suspense fallback={<PageLoader />}>
            {/* Разделы сменяются плавно, без резкого скачка содержимого. */}
            <div key={location.pathname} className="animate-page-in">
              <Outlet />
            </div>
          </Suspense>
        </main>
      </div>

      <Dialog open={isMenuOpen} onOpenChange={setIsMenuOpen}>
        <SheetContent title="Панель управления" side="left">
          <div className="flex min-h-full flex-col gap-6 p-4">
            <div className="flex-1">
              <SidebarNav groups={groups} onNavigate={closeMenu} />
            </div>
            <SidebarFooter onNavigate={closeMenu} />
          </div>
        </SheetContent>
      </Dialog>
    </div>
  );
}

export default AdminLayoutPage;
