import { memo, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { AppRoute } from '../../const';
import { useAppSelector } from '../../hooks';
import { getCanManageProducts } from '../../store/user-data/selectors';

type BtnAuthComponentProps = {
  userIsAuth: boolean;
  className?: string;
}

function BtnAuthComponent({userIsAuth, className}: BtnAuthComponentProps): ReactElement {
  const canManageProducts = useAppSelector(getCanManageProducts);
  const classText = `${className ? className + ' ' : ''}theme-btn-1 btn btn-effect-1 btn-auth`;

  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '14px' }}>
      {userIsAuth && canManageProducts && (
        <Link to={AppRoute.Admin} className="btn-admin-panel" title="Панель управления">
          <i className="icon-settings"></i>
        </Link>
      )}
      {userIsAuth ?
        <Link className={classText} to={AppRoute.Profile}>Личный кабинет</Link> :
        <Link className={classText} to={AppRoute.Login}>Войти</Link>
      }
    </div>
  )
}

export default memo(BtnAuthComponent);
