import { Navigate } from 'react-router-dom';
import { ReactElement } from 'react';

import { useAppSelector } from '../hooks';
import { getIsAuth } from '../store/user-data/selectors';
import { AppRoute } from '../const';
import RegisterFormComponent from '../components/register-form/register-form.component';
import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';

function RegisterPage(): ReactElement {
  const isAuth = useAppSelector(getIsAuth);

  if (isAuth) {
    return <Navigate to={AppRoute.Main} />
  }

  return (
    <>
      <BreadcrumbComponent
        title="Регистрация"
        links={[
          {title: 'Главная', href: AppRoute.Main},
        ]}
        pageName="Регистрация"
      />
      <RegisterFormComponent />
    </>
  )
}

export default RegisterPage;
