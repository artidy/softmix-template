import { ReactElement, useEffect } from 'react';
import { Link } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { fetchMyOrders } from '../store/orders-data/api-actions';
import { getOrders, getOrdersLoading } from '../store/orders-data/selectors';
import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';
import Loader from '../components/loader/loader.component';
import { formatDate, formatPrice } from '../utils/format';
import { ORDER_STATUS_BADGE, ORDER_STATUS_LABEL } from '../utils/order-labels';

function MyOrdersPage(): ReactElement {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(getOrders);
  const isLoading = useAppSelector(getOrdersLoading);

  useEffect(() => {
    dispatch(fetchMyOrders(undefined));
  }, [dispatch]);

  return (
    <>
      <BreadcrumbComponent
        title="Мои заказы"
        links={[
          { title: 'Главная', href: AppRoute.Main },
          { title: 'Профиль', href: AppRoute.Profile },
        ]}
        pageName="Мои заказы"
      />
      <div className="container my-5">
        {isLoading && <Loader />}
        {!isLoading && orders.length === 0 && (
          <div className="text-center py-5">
            <h4>У вас пока нет заказов</h4>
            <Link to={AppRoute.Shop} className="theme-btn-1 btn btn-effect-1 mt-3">
              Перейти в каталог
            </Link>
          </div>
        )}
        {!isLoading && orders.length > 0 && (
          <div className="table-responsive">
            <table className="table">
              <thead>
                <tr>
                  <th>Номер</th>
                  <th>Дата</th>
                  <th>Сумма</th>
                  <th>Статус</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order.id}>
                    <td>{order.orderNumber}</td>
                    <td>{formatDate(order.createdAt)}</td>
                    <td>{formatPrice(order.totalPrice)}</td>
                    <td>
                      <span className={`badge ${ORDER_STATUS_BADGE[order.status]}`}>
                        {ORDER_STATUS_LABEL[order.status]}
                      </span>
                    </td>
                    <td>
                      <Link
                        to={`${AppRoute.Orders}/${order.id}`}
                        className="btn btn-sm btn-outline-primary"
                      >
                        Подробнее
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </>
  );
}

export default MyOrdersPage;
