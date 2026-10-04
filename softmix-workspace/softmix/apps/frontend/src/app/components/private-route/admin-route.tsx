import { ReactElement } from 'react';
import { Navigate } from 'react-router';

import { useAppSelector } from '../../hooks';
import { getIsAdmin } from '../../store/user-data/selectors';
import { AppRoute } from '../../const';

type AdminRouteProps = {
  children: ReactElement;
};

function AdminRoute({ children }: AdminRouteProps): ReactElement {
  const isAdmin = useAppSelector(getIsAdmin);

  if (!isAdmin) {
    return <Navigate to={AppRoute.Admin} />;
  }

  return children;
}

export default AdminRoute;
