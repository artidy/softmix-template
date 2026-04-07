import { Navigate } from 'react-router-dom';

import { useAppSelector } from '../../hooks';
import { getIsAuth, getIsUnknown } from '../../store/user-data/selectors';
import { AppRoute } from '../../const';
import Loader from '../loader/loader.component';

type PrivateRouteProps = {
  children: JSX.Element;
};

function PrivateRoute(props: PrivateRouteProps): JSX.Element {
  const {children} = props;
  const isUnknown = useAppSelector(getIsUnknown);
  const isAuth = useAppSelector(getIsAuth);

  if (isUnknown) {
    return <Loader />;
  }

  if (isAuth) {
    return children;
  }

  return <Navigate to={AppRoute.Login} />;
}

export default PrivateRoute;
