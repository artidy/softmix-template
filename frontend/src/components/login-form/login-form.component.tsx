import {ChangeEvent, useState} from 'react';
import {Link} from 'react-router-dom';

const FOCUS_CLASS = 'focus';

const LoginFormComponent = (): JSX.Element => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isRemember, setRemember] = useState('false');

  const onChangeEmail = (evt: ChangeEvent<HTMLInputElement>) => {
    setEmail(evt.target.value);
  }

  const onChangePassword = (evt: ChangeEvent<HTMLInputElement>) => {
    setPassword(evt.target.value);
  }

  const onChangeRemember = (evt: ChangeEvent<HTMLInputElement>) => {
    setRemember(evt.target.value);
  }

  const onFocusField = (evt: ChangeEvent<HTMLInputElement>) => {
    evt.target.parentElement?.classList.add(FOCUS_CLASS);
  }

  const onBlurField = (evt: ChangeEvent<HTMLInputElement>) => {
    if (!evt.target.value) {
      evt.target.parentElement?.classList.remove(FOCUS_CLASS);
    }
  }

  return (
    <div className="side-login">
      <form action="#!" method="post" className="side-form">
        <div className="side-form-title item-heading">Авторизация</div>
        <div className="form-field">
          <label className="input-states-labelled" htmlFor="email">Email
            <span className="required">*</span>
          </label>
          <div className={`form-field-group ${email === '' ? '': FOCUS_CLASS}`}>
            <label htmlFor="email" className="form-field-label">Email</label>
            <input
              type="email"
              className="form-field-input"
              name="email"
              value={email}
              autoComplete="off"
              id="email"
              onChange={onChangeEmail}
              onFocus={onFocusField}
              onBlur={onBlurField}
              required
            />
          </div>
        </div>
        <div className="form-field">
          <label className="input-states-labelled" htmlFor="login-password">Пароль
            <span className="required">*</span>
          </label>
          <div className={`form-field-group ${password === '' ? '': FOCUS_CLASS}`}>
            <label htmlFor="login-password" className="form-field-label">Пароль</label>
            <input
              type="password"
              className="form-field-input"
              name="password"
              value={password}
              autoComplete="off"
              id="login-password"
              onChange={onChangePassword}
              onFocus={onFocusField}
              onBlur={onBlurField}
              required
            />
          </div>
        </div>
        <div className="form-field">
          <div className="checkbox">
            <input
              type="checkbox"
              className="checkbox-input"
              name="SignInCheckbox"
              id="login-checkbox"
              value={isRemember}
              onChange={onChangeRemember}
            />
            <label htmlFor="login-checkbox" className="checkbox-label">Запомнить</label>
          </div>
        </div>
        <div className="form-btn">
          <button type="submit" className="btn btn-wide ripple"><span>Войти</span></button>
        </div>
        <nav className="side-form-nav">
          <div className="sfn-row">
            <Link to="#!">Забыли пароль?</Link>
          </div>
          <div className="sfn-row">
            У вас еще нет аккаунта? <br />
            <Link to="#!">Создайте</Link>
          </div>
        </nav>
      </form>
    </div>
  )
}

export default LoginFormComponent;
