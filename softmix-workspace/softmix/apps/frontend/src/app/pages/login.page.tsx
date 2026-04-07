import { Navigate } from 'react-router-dom';
import { ReactElement } from 'react';

import { useAppSelector } from '../hooks';
import { getIsAuth } from '../store/user-data/selectors';
import { AppRoute } from '../const';
import LoginFormComponent from '../components/login-form/login-form.component';
import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';

function LoginPage(): ReactElement {
  const isAuth = useAppSelector(getIsAuth);

  if (isAuth) {
    return <Navigate to={AppRoute.Main} />
  }

  return (
    <>
      <BreadcrumbComponent
        title="Авторизация"
        links={[
          {title: 'Главная', href: AppRoute.Main},
        ]}
        pageName="Вход"
      />
      <LoginFormComponent />
    </>
  )
}

export default LoginPage;
