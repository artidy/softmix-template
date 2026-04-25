import { ReactElement, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { fetchMyOrders } from '../store/orders-data/api-actions';
import { initPayment } from '../store/orders-data/payment-actions';
import { getOrders, getOrdersLoading } from '../store/orders-data/selectors';
import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';
import Loader from '../components/loader/loader.component';
import { formatPrice } from '../utils/format';

function PaymentFailedPage(): ReactElement {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const orderNumber = params.get('order');
  const orders = useAppSelector(getOrders);
  const isLoading = useAppSelector(getOrdersLoading);

  useEffect(() => {
    dispatch(fetchMyOrders(undefined));
  }, [dispatch]);

  const order = useMemo(
    () => (orderNumber ? orders.find((o) => o.orderNumber === orderNumber) ?? null : null),
    [orders, orderNumber],
  );

  const retry = async () => {
    if (!order) return;
    const result = await dispatch(initPayment(order.id)).unwrap();
    if (result?.redirectUrl) {
      window.location.href = result.redirectUrl;
    }
  };

  if (isLoading) {
    return <Loader />;
  }

  return (
    <>
      <BreadcrumbComponent
        title="Оплата"
        links={[{ title: 'Главная', href: AppRoute.Main }]}
        pageName="Не удалось оплатить"
      />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2>Платёж не прошёл</h2>
            {order ? (
              <p className="lead">
                Заказ <strong>{order.orderNumber}</strong> на сумму{' '}
                <strong>{formatPrice(order.totalPrice)}</strong> не оплачен.
              </p>
            ) : (
              <p>Платёж не прошёл. Попробуйте ещё раз или выберите другой способ оплаты.</p>
            )}
            <div className="d-flex gap-2 justify-content-center mt-4">
              {order && (
                <button type="button" className="theme-btn-1 btn btn-effect-1" onClick={retry}>
                  Попробовать снова
                </button>
              )}
              <Link to={AppRoute.Orders} className="btn btn-outline-secondary">
                Мои заказы
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentFailedPage;
