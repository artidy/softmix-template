import { ReactNode } from 'react';
import { Link, Navigate, useNavigate } from 'react-router';
import { ChevronRight, LayoutDashboard, LogOut, Package, UserRound } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute, USER_ROLES } from '../const';
import { getInitials } from '../lib/format';
import { useDocumentTitle } from '../lib/use-document-title';
import { getCanManageProducts, getIsAuth, getUser } from '../store/user-data/selectors';
import { logoutUserApi } from '../store/user-data/api-actions';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Card } from '../ui/card';
import { Container } from '../ui/layout';
import { PageHeader } from '../ui/page-header';

function QuickLink({ to, icon, label }: { to: string; icon: ReactNode; label: string }) {
  return (
    <Link
      to={to}
      className="group flex items-center gap-3 rounded-xl px-3 py-3 text-sm font-medium transition-colors hover:bg-accent [&>svg:first-child]:size-5 [&>svg:first-child]:text-muted-foreground"
    >
      {icon}
      <span className="flex-1">{label}</span>
      <ChevronRight className="size-4 text-muted-foreground transition-transform group-hover:translate-x-0.5" aria-hidden="true" />
    </Link>
  );
}

function ProfilePage() {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const isAuth = useAppSelector(getIsAuth);
  const user = useAppSelector(getUser);
  const canManage = useAppSelector(getCanManageProducts);

  useDocumentTitle('Личный кабинет');

  if (!isAuth || !user) {
    return <Navigate to={AppRoute.Login} />;
  }

  const handleLogout = async () => {
    await dispatch(logoutUserApi());
    navigate(AppRoute.Main);
  };

  const roleTitle = USER_ROLES.find((item) => String(item.role) === String(user.role))?.title ?? 'Пользователь';

  const facts = [
    { label: 'Имя', value: user.name },
    { label: 'Логин', value: user.login },
    { label: 'Email', value: user.email },
    { label: 'Телефон', value: user.phone },
    { label: 'Дата регистрации', value: user.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : undefined },
  ].filter((item) => item.value);

  return (
    <>
      <PageHeader
        title="Личный кабинет"
        description="Информация о вашем аккаунте"
        breadcrumbs={[{ label: 'Главная', to: AppRoute.Main }, { label: 'Профиль' }]}
      />
      <Container className="grid grid-cols-1 items-start gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_20rem] lg:gap-8 lg:py-10">
        <Card className="p-6 sm:p-8">
          <div className="flex items-center gap-4">
            <span className="grid size-16 shrink-0 place-items-center rounded-full bg-linear-to-br from-primary-soft to-highlight-soft text-xl font-semibold text-primary">
              {getInitials(user.name || user.login) || <UserRound className="size-6" />}
            </span>
            <div className="min-w-0">
              <p className="truncate text-xl font-semibold">{user.name || user.login}</p>
              <Badge variant="primary" className="mt-1.5">
                {roleTitle}
              </Badge>
            </div>
          </div>
          <dl className="mt-8 grid gap-x-8 gap-y-5 sm:grid-cols-2">
            {facts.map((item) => (
              <div key={item.label}>
                <dt className="text-xs font-medium uppercase tracking-wider text-muted-foreground">{item.label}</dt>
                <dd className="mt-1 break-words font-medium">{item.value}</dd>
              </div>
            ))}
          </dl>
        </Card>

        <Card className="p-3">
          <nav aria-label="Разделы кабинета" className="grid gap-0.5">
            <QuickLink to={AppRoute.Orders} icon={<Package />} label="Мои заказы" />
            {canManage && <QuickLink to={AppRoute.Admin} icon={<LayoutDashboard />} label="Панель управления" />}
          </nav>
          <div className="mt-2 border-t pt-2">
            <Button
              variant="ghost"
              className="w-full justify-start gap-3 px-3 text-destructive hover:bg-destructive/10 hover:text-destructive [&_svg]:size-5"
              onClick={handleLogout}
            >
              <LogOut />
              Выйти из аккаунта
            </Button>
          </div>
        </Card>
      </Container>
    </>
  );
}

export default ProfilePage;
