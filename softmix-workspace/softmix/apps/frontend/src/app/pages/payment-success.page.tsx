import { ReactElement, useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { fetchMyOrders, fetchOrderById } from '../store/orders-data/api-actions';
import {
  getCurrentOrder,
  getOrders,
  getOrdersLoading,
} from '../store/orders-data/selectors';
import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';
import Loader from '../components/loader/loader.component';
import { formatPrice } from '../utils/format';
import { ORDER_STATUS_LABEL, PAYMENT_STATUS_LABEL } from '../utils/order-labels';

function PaymentSuccessPage(): ReactElement {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const orderNumber = params.get('order');
  const orderId = params.get('id');
  const orders = useAppSelector(getOrders);
  const current = useAppSelector(getCurrentOrder);
  const isLoading = useAppSelector(getOrdersLoading);

  useEffect(() => {
    if (orderId) {
      dispatch(fetchOrderById(orderId));
    } else if (orderNumber) {
      dispatch(fetchMyOrders(undefined));
    }
  }, [dispatch, orderId, orderNumber]);

  const order = useMemo(() => {
    if (current && (current.id === orderId || current.orderNumber === orderNumber)) {
      return current;
    }
    if (orderNumber) {
      return orders.find((o) => o.orderNumber === orderNumber) ?? null;
    }
    return null;
  }, [current, orders, orderId, orderNumber]);

  useEffect(() => {
    if (order && order.id !== current?.id) {
      dispatch(fetchOrderById(order.id));
    }
  }, [dispatch, order, current?.id]);

  if (isLoading || !order) {
    return <Loader />;
  }

  return (
    <>
      <BreadcrumbComponent
        title="Оплата"
        links={[{ title: 'Главная', href: AppRoute.Main }]}
        pageName="Оплата получена"
      />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2>Спасибо! Платёж обрабатывается</h2>
            <p className="lead">
              Заказ <strong>{order.orderNumber}</strong> на сумму{' '}
              <strong>{formatPrice(order.totalPrice)}</strong>.
            </p>
            <p>
              Статус заказа: <strong>{ORDER_STATUS_LABEL[order.status]}</strong>
              <br />
              Статус оплаты: <strong>{PAYMENT_STATUS_LABEL[order.payment.status]}</strong>
            </p>
            <p className="text-muted small">
              Если статус ещё «Ожидает оплаты», обновите страницу через минуту — банк передаёт
              подтверждение асинхронно.
            </p>
            <div className="d-flex gap-2 justify-content-center mt-4">
              <Link to={`${AppRoute.Orders}/${order.id}`} className="theme-btn-1 btn btn-effect-1">
                Открыть заказ
              </Link>
              <Link to={AppRoute.Shop} className="btn btn-outline-secondary">
                Продолжить покупки
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default PaymentSuccessPage;
