import {useAppSelector} from '../../hooks/store';

import './user.scss';

const UserComponent = (): JSX.Element => {
  const {user} = useAppSelector(({USER}) => USER);

  return (
    <>
      <header className="mini-header">
        <div className="side-title item-heading">Текущий пользователь</div>
      </header>
      <div className="mini-container">
        <div>
          <label className="mini-label">Email:</label>
          <span>{user?.email}</span>
        </div>
        <div>
          <label className="mini-label">Имя:</label>
          <span>{user?.name}</span>
        </div>
      </div>
    </>
  )
}

export default UserComponent;
