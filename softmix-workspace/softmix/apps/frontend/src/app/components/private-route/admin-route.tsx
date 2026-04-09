import { Navigate } from 'react-router-dom';

import { useAppSelector } from '../../hooks';
import { getIsAdmin } from '../../store/user-data/selectors';
import { AppRoute } from '../../const';

type AdminRouteProps = {
  children: JSX.Element;
};

function AdminRoute({ children }: AdminRouteProps): JSX.Element {
  const isAdmin = useAppSelector(getIsAdmin);

  if (!isAdmin) {
    return <Navigate to={AppRoute.Admin} />;
  }

  return children;
}

export default AdminRoute;
