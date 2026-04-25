import { FormEvent, ReactElement, useState } from 'react';

import { useAppDispatch } from '../../hooks';
import { addUserApi, updateUserApi } from '../../store/user-data/api-actions';
import { USER_ROLES } from '../../const';
import { UpdateUser, User, UserRole } from '../../types/user';

type AddUserComponentProps = {
  createMode: boolean;
  user: User | null;
  callback: () => void;
};

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function AddUserComponent({ createMode, user, callback }: AddUserComponentProps): ReactElement {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>(createMode ? '' : user?.name ?? '');
  const [login, setLogin] = useState<string>(createMode ? '' : user?.login ?? '');
  const [email, setEmail] = useState<string>(createMode ? '' : user?.email ?? '');
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<UserRole>(createMode ? UserRole.User : user?.role ?? UserRole.User);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = (): boolean => {
    const next: Record<string, string> = {};
    if (!name.trim() || name.trim().length < 2) next.name = 'Имя должно содержать минимум 2 символа';
    if (createMode) {
      if (!login.trim() || login.trim().length < 3) next.login = 'Логин минимум 3 символа';
      if (!password || password.length < 6) next.password = 'Пароль минимум 6 символов';
    } else if (password && password.length < 6) {
      next.password = 'Пароль минимум 6 символов';
    }
    if (email && !EMAIL_REGEX.test(email.trim())) next.email = 'Некорректный email';
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const onSubmit = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();
    if (!validate()) return;

    if (createMode) {
      dispatch(
        addUserApi({
          name: name.trim(),
          login: login.trim(),
          email: email.trim() || undefined,
          password,
          role,
        }),
      );
      return;
    }

    if (!user) return;
    const update: UpdateUser = { id: user.id };
    if (name !== user.name) update.name = name.trim();
    if (password) update.password = password;
    if (role !== user.role) update.role = role;
    if (Object.keys(update).length > 1) {
      dispatch(updateUserApi(update));
    } else {
      callback();
    }
  };

  const cls = (key: string) => `form-control${errors[key] ? ' is-invalid' : ''}`;

  return (
    <form className="app-form" onSubmit={onSubmit}>
      <div className="form-section">
        <h6 className="form-section__title">Профиль</h6>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Имя*</label>
            <input
              type="text"
              className={cls('name')}
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoComplete="off"
              autoFocus={createMode}
            />
            {errors.name && <div className="invalid-feedback">{errors.name}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Логин{createMode ? '*' : ''}</label>
            <input
              type="text"
              className={cls('login')}
              value={login}
              onChange={(e) => setLogin(e.target.value)}
              readOnly={!createMode}
              autoComplete="off"
            />
            {errors.login && <div className="invalid-feedback">{errors.login}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">Email</label>
            <input
              type="email"
              className={cls('email')}
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              readOnly={!createMode}
              autoComplete="off"
            />
            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
          </div>
          <div className="col-md-6">
            <label className="form-label">
              Пароль{createMode ? '*' : ''}
              {!createMode && <small className="text-muted ms-1">(оставьте пустым, чтобы не менять)</small>}
            </label>
            <input
              type="password"
              className={cls('password')}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="new-password"
            />
            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
          </div>
        </div>
      </div>

      <div className="form-section">
        <h6 className="form-section__title">Роль</h6>
        <div className="d-flex gap-2 flex-wrap">
          {USER_ROLES.map((r) => (
            <label
              key={r.role}
              className={`role-pill${r.role === role ? ' is-active' : ''}`}
            >
              <input
                type="radio"
                name="role"
                value={r.role}
                checked={r.role === role}
                onChange={(e) => setRole(e.target.value as UserRole)}
                className="visually-hidden"
              />
              <span>{r.title}</span>
            </label>
          ))}
        </div>
      </div>

      <div className="app-form__footer">
        <button type="button" className="btn btn-outline-secondary" onClick={callback}>
          Отмена
        </button>
        <button type="submit" className="btn btn-primary">
          {createMode ? 'Создать' : 'Сохранить'}
        </button>
      </div>
    </form>
  );
}

export default AddUserComponent;
