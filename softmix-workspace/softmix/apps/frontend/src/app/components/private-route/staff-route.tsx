import { ReactElement } from 'react';
import { Navigate } from 'react-router';

import { useAppSelector } from '../../hooks';
import { getCanManageProducts } from '../../store/user-data/selectors';
import { AppRoute } from '../../const';

type StaffRouteProps = {
  children: ReactElement;
};

function StaffRoute({ children }: StaffRouteProps): ReactElement {
  const canManage = useAppSelector(getCanManageProducts);

  if (!canManage) {
    return <Navigate to={AppRoute.Main} />;
  }

  return children;
}

export default StaffRoute;
