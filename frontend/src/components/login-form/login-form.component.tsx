import {Link} from 'react-router-dom';

const LoginFormComponent = (): JSX.Element => {
  return (
    <div className="side-login">
      <form action="#!" method="post" className="side-form">
        <div className="side-form-title item-heading">Авторизация</div>
        <div className="form-field">
          <label className="input-states-labelled" htmlFor="login-username">Логин
            <span className="required">*</span>
          </label>
          <div className="form-field-group">
            <label htmlFor="login-username" className="form-field-label">Логин</label>
            <input
              type="text"
              className="form-field-input"
              name="SignInUsernameOrEmail"
              value=""
              autoComplete="off"
              id="login-username"
              required={true}
            />
          </div>
        </div>
        <div className="form-field">
          <label className="input-states-labelled" htmlFor="login-password">Пароль
            <span className="required">*</span>
          </label>
          <div className="form-field-group">
            <label htmlFor="login-password" className="form-field-label">Пароль</label>
            <input
              type="password"
              className="form-field-input"
              name="SignInPassword"
              value=""
              autoComplete="off"
              id="login-password"
              required={true}
            />
          </div>
        </div>
        <div className="form-field">
          <div className="checkbox">
            <input type="checkbox" className="checkbox-input" name="SignInCheckbox" id="login-checkbox" />
            <label htmlFor="login-checkbox" className="checkbox-label">Запомнить</label>
          </div>
        </div>
        <div className="form-btn">
          <button type="submit" className="btn btn-wide ripple"><span>Логин</span></button>
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
