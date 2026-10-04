import { Link, useNavigate } from 'react-router';
import { LayoutDashboard, LogIn, LogOut, Package, UserRound } from 'lucide-react';

import { AppRoute } from '../const';
import { getInitials } from '../lib/format';
import { useAppDispatch, useAppSelector } from '../hooks';
import { getCanManageProducts, getIsAuth, getIsUnknown, getUser } from '../store/user-data/selectors';
import { logoutUserApi } from '../store/user-data/api-actions';
import { buttonVariants } from '../ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';

export function UserMenu() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuth = useAppSelector(getIsAuth);
  const isUnknown = useAppSelector(getIsUnknown);
  const user = useAppSelector(getUser);
  const canManage = useAppSelector(getCanManageProducts);

  // Пока проверяется сохранённый вход — нейтральное место под аватар, без мелькания кнопки «Войти».
  if (isUnknown) {
    return <span className="block size-9 animate-pulse rounded-full bg-secondary" aria-hidden="true" />;
  }

  if (!isAuth || !user) {
    return (
      <Link to={AppRoute.Login} className={buttonVariants({ variant: 'outline', size: 'sm', className: 'h-9' })}>
        <LogIn />
        Войти
      </Link>
    );
  }

  const handleLogout = async () => {
    await dispatch(logoutUserApi());
    navigate(AppRoute.Main);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className="grid size-9 place-items-center rounded-full bg-primary-soft text-sm font-semibold text-primary ring-offset-background transition-shadow hover:ring-2 hover:ring-primary/30 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        aria-label="Меню аккаунта"
      >
        {getInitials(user.name || user.login) || <UserRound className="size-4" />}
      </DropdownMenuTrigger>
      <DropdownMenuContent>
        <DropdownMenuLabel>
          <p className="truncate font-medium">{user.name || user.login}</p>
          <p className="truncate text-xs text-muted-foreground">{user.email || user.login}</p>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to={AppRoute.Profile}>
            <UserRound />
            Профиль
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link to={AppRoute.Orders}>
            <Package />
            Мои заказы
          </Link>
        </DropdownMenuItem>
        {canManage && (
          <DropdownMenuItem asChild>
            <Link to={AppRoute.Admin}>
              <LayoutDashboard />
              Панель управления
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem destructive onSelect={handleLogout}>
          <LogOut />
          Выйти
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
