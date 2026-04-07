import { MouseEvent, ReactElement } from 'react';
import { Navigate } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks';
import { getIsAuth, getUser } from '../store/user-data/selectors';
import { AppRoute, TOKEN } from '../const';
import { dropToken } from '../services/token';
import { logoutUserApi } from '../store/user-data/api-actions';
import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';

function ProfilePage(): ReactElement {
  const dispatch = useAppDispatch();
  const isAuth = useAppSelector(getIsAuth);
  const user = useAppSelector(getUser);

  const logOutHandler = (evt: MouseEvent) => {
    evt.preventDefault();

    dropToken(TOKEN);
    dispatch(logoutUserApi());
  }

  if (!isAuth) {
    return <Navigate to={AppRoute.Login} />
  }

  return (
    <>
      <BreadcrumbComponent
        title="Личный кабинет"
        links={[
          {title: 'Главная', href: AppRoute.Main},
        ]}
        pageName="Профиль"
      />
      <div className="ltn__login-area pb-85">
        <div className="container">
          <div className="row">
            <div className="col-lg-12">
              <div className="section-title-area text-center">
                <h1>Личный кабинет</h1>
                <p>Информация о вашем аккаунте</p>
              </div>
            </div>
          </div>
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="account-login-inner">
                <div className="ltn__form-box">
                  <div className="mb-4">
                    <h5>Имя пользователя</h5>
                    <p className="lead">{user?.name}</p>
                  </div>
                  <div className="mb-4">
                    <h5>Email</h5>
                    <p className="lead">{user?.login}</p>
                  </div>
                  <div className="mb-4">
                    <h5>Роль</h5>
                    <p className="lead">{user?.role === 'admin' ? 'Администратор' : user?.role === 'manager' ? 'Менеджер' : 'Пользователь'}</p>
                  </div>
                  <div className="mb-4">
                    <h5>Дата регистрации</h5>
                    <p className="lead">{user?.createdAt ? new Date(user.createdAt).toLocaleDateString('ru-RU') : '-'}</p>
                  </div>
                  <div className="btn-wrapper mt-4">
                    <button className="theme-btn-1 btn btn-block" type="button" onClick={logOutHandler}>Выйти из аккаунта</button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export default ProfilePage;
