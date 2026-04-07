import { memo, ReactElement } from 'react';
import { Link } from 'react-router-dom';

import { AppRoute } from '../../const';
import { useAppSelector } from '../../hooks';
import { getCanManageProducts } from '../../store/user-data/selectors';

type MenuComponentProps = {
  userIsAuth: boolean;
}

function MenuComponent({userIsAuth}: MenuComponentProps): ReactElement {
  const canManageProducts = useAppSelector(getCanManageProducts);

  return (
    <ul>
      <li><Link to={AppRoute.Main}>Главная</Link></li>
      <li><Link to={AppRoute.Shop}>Каталог</Link></li>
      {canManageProducts ?
        <li><Link to={AppRoute.Admin}>Панель управления</Link></li> :
        null
      }
      <li><Link to={AppRoute.About}>О нас</Link></li>
      <li><Link to={AppRoute.Contacts}>Контакты</Link></li>
    </ul>
  )
}

export default memo(MenuComponent);
