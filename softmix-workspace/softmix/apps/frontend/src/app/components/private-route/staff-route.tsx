import { Navigate } from 'react-router-dom';

import { useAppSelector } from '../../hooks';
import { getCanManageProducts } from '../../store/user-data/selectors';
import { AppRoute } from '../../const';

type StaffRouteProps = {
  children: JSX.Element;
};

function StaffRoute({ children }: StaffRouteProps): JSX.Element {
  const canManage = useAppSelector(getCanManageProducts);

  if (!canManage) {
    return <Navigate to={AppRoute.Main} />;
  }

  return children;
}

export default StaffRoute;
