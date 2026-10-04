import { ReactElement } from 'react';
import { Navigate, useLocation } from 'react-router';

import { useAppSelector } from '../../hooks';
import { getIsAuth, getIsUnknown } from '../../store/user-data/selectors';
import { AppRoute } from '../../const';
import { PageLoader } from '../../ui/feedback';

type PrivateRouteProps = {
  children: ReactElement;
};

function PrivateRoute({ children }: PrivateRouteProps): ReactElement {
  const location = useLocation();
  const isUnknown = useAppSelector(getIsUnknown);
  const isAuth = useAppSelector(getIsAuth);

  if (isUnknown) {
    return <PageLoader />;
  }

  if (isAuth) {
    return children;
  }

  // После входа вернём пользователя туда, куда он шёл.
  return <Navigate to={AppRoute.Login} state={{ from: `${location.pathname}${location.search}` }} replace />;
}

export default PrivateRoute;
