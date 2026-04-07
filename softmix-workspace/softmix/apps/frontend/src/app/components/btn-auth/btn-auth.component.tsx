import { memo, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { AppRoute } from '../../const';

type BtnAuthComponentProps = {
  userIsAuth: boolean;
  className?: string;
}

function BtnAuthComponent({userIsAuth, className}: BtnAuthComponentProps): ReactElement {
  const classText = `${className ? className + ' ' : ''}theme-btn-1 btn btn-effect-1 btn-auth`;

  return (
    userIsAuth ?
      <Link className={classText} to={AppRoute.Profile}>Личный кабинет</Link> :
      <Link className={classText} to={AppRoute.Login}>Войти</Link>
  )
}

export default memo(BtnAuthComponent);
