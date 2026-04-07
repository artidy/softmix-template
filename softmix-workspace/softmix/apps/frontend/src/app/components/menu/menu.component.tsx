import { memo, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { AppRoute } from '../../const';

type MenuComponentProps = {
  userIsAuth: boolean;
}

function MenuComponent({userIsAuth}: MenuComponentProps): ReactElement {
  return (
    <ul>
      <li><Link to={AppRoute.Main}>Главная</Link></li>
      <li><Link to={AppRoute.Shop}>Каталог</Link></li>
      {userIsAuth ?
        <li><Link to={AppRoute.Downloads}>Загрузка</Link></li> :
        null
      }
      <li><Link to={AppRoute.About}>О нас</Link></li>
      <li><Link to={AppRoute.Contacts}>Контакты</Link></li>
    </ul>
  )
}

export default memo(MenuComponent);
