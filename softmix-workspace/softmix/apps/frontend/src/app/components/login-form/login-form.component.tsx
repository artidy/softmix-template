import { FormEvent, memo, ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

import { login } from '../../store/user-data/api-actions';
import { useAppDispatch } from '../../hooks';
import { AppRoute } from '../../const';

function LoginFormComponent(): ReactElement {
  const dispatch = useAppDispatch();
  const [userLogin, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const handleSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    dispatch(login({
      login: userLogin,
      password
    }));
  };

  return (
    <div className="ltn__login-area pb-85">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-area text-center">
              <h1>Войти <br/>в свой аккаунт</h1>
              <p>Войдите в аккаунт чтобы получить доступ к закрытой части сайта.</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6">
            <div className="account-login-inner">
              <form className="ltn__form-box contact-form-box" method="post" action="#" onSubmit={handleSubmit}>
                <input
                  type="text"
                  name="email"
                  placeholder="Email*"
                  value={userLogin}
                  onChange={(evt) => setEmail(evt.target.value)}
                  required
                />
                <input
                  type="password"
                  name="password"
                  placeholder="Пароль*"
                  value={password}
                  onChange={(evt) => setPassword(evt.target.value)}
                  required
                />
                <div className="btn-wrapper mt-0">
                  <button className="theme-btn-1 btn btn-block" type="submit">Войти</button>
                </div>
                <div className="go-to-btn mt-20">
                  <Link to="#"><small>Забыли пароль?</small></Link>
                </div>
              </form>
            </div>
          </div>
          <div className="col-lg-6">
            <div className="account-create text-center pt-50">
              <h4>Еще нет аккаунта?</h4>
              <p>Перейдите по ссылке чтобы зарегистрировать новый аккаунт.</p>
              <div className="btn-wrapper">
                <Link to={AppRoute.Register} className="theme-btn-1 black-btn">Зарегистрировать</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default memo(LoginFormComponent);
