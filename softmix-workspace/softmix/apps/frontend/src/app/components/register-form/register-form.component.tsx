import { FormEvent, memo, ReactElement, useState } from 'react';
import { Link } from 'react-router-dom';

import { register, resendVerification } from '../../store/user-data/api-actions';
import { useAppDispatch } from '../../hooks';
import { AppRoute } from '../../const';
import { UserRole } from '@project-lib/shared-types';

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function RegisterFormComponent(): ReactElement {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>('');
  const [userLogin, setLogin] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [confirmPassword, setConfirmPassword] = useState<string>('');
  const [error, setError] = useState<string>('');
  const [submitted, setSubmitted] = useState(false);
  const [submittedEmail, setSubmittedEmail] = useState('');

  const handleSubmit = async (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    setError('');

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }
    if (password.length < 6) {
      setError('Пароль должен содержать минимум 6 символов');
      return;
    }
    if (name.length < 2) {
      setError('Имя должно содержать минимум 2 символа');
      return;
    }
    if (userLogin.length < 3) {
      setError('Логин должен содержать минимум 3 символа');
      return;
    }
    const trimmedEmail = email.trim();
    if (!EMAIL_REGEX.test(trimmedEmail)) {
      setError('Некорректный email');
      return;
    }

    const success = await dispatch(register({
      name,
      login: userLogin,
      email: trimmedEmail,
      password,
      role: UserRole.User,
    })).unwrap();

    if (success) {
      setSubmitted(true);
      setSubmittedEmail(trimmedEmail);
    }
  };

  const handleResend = () => {
    if (submittedEmail) {
      dispatch(resendVerification(submittedEmail));
    }
  };

  if (submitted) {
    return (
      <div className="ltn__login-area pb-85">
        <div className="container">
          <div className="row">
            <div className="col-lg-6 offset-lg-3">
              <div className="account-login-inner text-center">
                <h2>Проверьте почту</h2>
                <p>
                  Мы отправили письмо с подтверждением на <strong>{submittedEmail}</strong>.
                  Перейдите по ссылке из письма, чтобы активировать аккаунт.
                </p>
                <p className="text-muted">
                  Не пришло письмо? Проверьте папку «Спам».
                </p>
                <div className="d-flex flex-column gap-2 mt-4">
                  <button type="button" className="btn btn-outline-primary" onClick={handleResend}>
                    Отправить ссылку повторно
                  </button>
                  <Link to={AppRoute.Login} className="btn btn-link">
                    Перейти ко входу
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="ltn__login-area pb-85">
      <div className="container">
        <div className="row">
          <div className="col-lg-12">
            <div className="section-title-area text-center">
              <h1>Регистрация <br/>нового аккаунта</h1>
              <p>Создайте новый аккаунт чтобы получить доступ к закрытой части сайта.</p>
            </div>
          </div>
        </div>
        <div className="row">
          <div className="col-lg-6 offset-lg-3">
            <div className="account-login-inner">
              <form className="ltn__form-box contact-form-box" method="post" onSubmit={handleSubmit}>
                {error && (
                  <div className="alert alert-danger" role="alert">
                    {error}
                  </div>
                )}
                <input
                  type="text"
                  name="name"
                  placeholder="Имя*"
                  value={name}
                  onChange={(evt) => setName(evt.target.value)}
                  required
                  minLength={2}
                />
                <input
                  type="text"
                  name="login"
                  placeholder="Логин*"
                  value={userLogin}
                  onChange={(evt) => setLogin(evt.target.value)}
                  required
                  minLength={3}
                />
                <input
                  type="email"
                  name="email"
                  placeholder="Email*"
                  value={email}
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
                  minLength={6}
                />
                <input
                  type="password"
                  name="confirmPassword"
                  placeholder="Подтвердите пароль*"
                  value={confirmPassword}
                  onChange={(evt) => setConfirmPassword(evt.target.value)}
                  required
                  minLength={6}
                />
                <div className="btn-wrapper mt-0">
                  <button className="theme-btn-1 btn btn-block" type="submit">
                    Зарегистрироваться
                  </button>
                </div>
                <div className="go-to-btn mt-20 text-center">
                  <p>
                    Уже есть аккаунт? <Link to={AppRoute.Login}>Войти</Link>
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default memo(RegisterFormComponent);
