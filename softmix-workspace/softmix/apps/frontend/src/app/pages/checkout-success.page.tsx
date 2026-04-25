import { ReactElement, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { fetchOrderById } from '../store/orders-data/api-actions';
import { getCurrentOrder, getOrdersLoading } from '../store/orders-data/selectors';
import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';
import Loader from '../components/loader/loader.component';
import { formatPrice } from '../utils/format';
import { ORDER_STATUS_LABEL, PAYMENT_LABEL } from '../utils/order-labels';

function CheckoutSuccessPage(): ReactElement {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const orderId = params.get('id');
  const order = useAppSelector(getCurrentOrder);
  const isLoading = useAppSelector(getOrdersLoading);

  useEffect(() => {
    if (orderId && (!order || order.id !== orderId)) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId, order]);

  if (isLoading || !order) {
    return <Loader />;
  }

  return (
    <>
      <BreadcrumbComponent
        title="Заказ оформлен"
        links={[{ title: 'Главная', href: AppRoute.Main }]}
        pageName="Спасибо!"
      />
      <div className="container my-5">
        <div className="row justify-content-center">
          <div className="col-lg-8 text-center">
            <h2>Спасибо, заказ принят!</h2>
            <p className="lead">
              Номер заказа: <strong>{order.orderNumber}</strong>
            </p>
            <p>
              Текущий статус: <strong>{ORDER_STATUS_LABEL[order.status]}</strong>
              <br />
              Способ оплаты: {PAYMENT_LABEL[order.payment.method]}
            </p>
            <p>
              Сумма к оплате: <strong>{formatPrice(order.totalPrice)}</strong>
            </p>
            <p className="text-muted">
              Подробности отправлены на {order.contact.email}. Менеджер свяжется с вами по номеру{' '}
              {order.contact.phone}.
            </p>
            <div className="d-flex gap-2 justify-content-center mt-4">
              <Link to={AppRoute.Orders} className="theme-btn-1 btn btn-effect-1">
                Мои заказы
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

export default CheckoutSuccessPage;
