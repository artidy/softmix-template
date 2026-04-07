import { FormEvent, useState } from 'react';

import { useAppDispatch } from '../../hooks';
import { addUserApi, updateUserApi } from '../../store/user-data/api-actions';
import { USER_ROLES } from '../../const';
import { UpdateUser, User, UserRole } from '../../types/user';

type AddUserComponentProps = {
  createMode: boolean;
  user: User;
  callback: () => void;
}

function AddUserComponent({createMode, user, callback}: AddUserComponentProps) {
  const dispatch = useAppDispatch();
  const [name, setName] = useState<string>(createMode ? '' : user.name);
  const [login, setEmail] = useState<string>(createMode ? '' : user.login);
  const [password, setPassword] = useState<string>('');
  const [role, setRole] = useState<UserRole>(createMode ? UserRole.User : user.role);
  const [readOnly, setReadOnly] = useState<boolean>(!createMode);

  const setEditMode = () => {
    setReadOnly(!readOnly);

    if (!readOnly) {
      cancelHandler();
    }
  }

  const handleSubmitCreate = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    dispatch(addUserApi({
      name,
      login,
      password,
      role,
    }));
  };

  const handleSubmitUpdate = (evt: FormEvent<HTMLFormElement>) => {
    evt.preventDefault();

    const updatedUser: UpdateUser = {
      id: user.id,
    }

    if (name !== user.name) {
      updatedUser.name = name;
    }

    if (password) {
      updatedUser.password = password;
    }

    if (role !== user.role) {
      updatedUser.role = role;
    }

    dispatch(updateUserApi(updatedUser));
  };

  const cancelHandler = () => {
    callback();
  }

  const rolesBlock = USER_ROLES.map((userRole) => {
    return (
      <label key={userRole.role} className={`role-btn${userRole.role === role ? ' active' : ''}`}>
        <input
          className="visually-hidden"
          type="radio"
          name="role"
          value={userRole.role}
          readOnly={readOnly}
          onChange={(evt) => setRole(evt.target.value as UserRole)}
          checked={userRole.role === role}
        />
        <span className="role-btn__btn">{userRole.title}</span>
      </label>
    )
  });

  return (
    <form method="post" action="#" onSubmit={createMode ? handleSubmitCreate : handleSubmitUpdate}>
      <div>
        <div>
          <div>
            <label>
              <span>Имя</span>
              <span>
                <input
                  type="text"
                  name="name"
                  id="name"
                  autoComplete="new-name"
                  value={name}
                  readOnly={readOnly}
                  onChange={(evt) => setName(evt.target.value)}
                  required
                />
              </span>
            </label>
          </div>
          <div>
            <label>
              <span>Логин</span>
              <span>
                <input
                  type="text"
                  name="login"
                  id="login"
                  autoComplete="new-login"
                  value={login}
                  readOnly={readOnly}
                  onChange={(evt) => setEmail(evt.target.value)}
                  required
                />
              </span>
            </label>
          </div>
          <div>
            <label>
              <span>Пароль</span>
              <span>
                <input
                  type="password"
                  name="password"
                  id="password"
                  autoComplete="new-password"
                  value={password}
                  readOnly={readOnly}
                  onChange={(evt) => setPassword(evt.target.value)}
                  required
                />
              </span>
            </label>
          </div>
        </div>
        <div>
          <h2>Выберите роль</h2>
          <div>
            {rolesBlock}
          </div>
        </div>
      </div>
    </form>
  )
}

export default AddUserComponent;
