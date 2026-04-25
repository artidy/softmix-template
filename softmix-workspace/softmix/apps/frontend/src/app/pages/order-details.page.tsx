import { ReactElement, useEffect } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DeliveryType, PaymentMethod, PaymentStatus } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute, DEFAULT_PRODUCT_IMG } from '../const';
import { fetchOrderById } from '../store/orders-data/api-actions';
import { initPayment } from '../store/orders-data/payment-actions';
import { getCurrentOrder, getOrdersLoading } from '../store/orders-data/selectors';
import BreadcrumbComponent from '../components/breadcrumb/breadcrumb.component';
import Loader from '../components/loader/loader.component';
import { formatDate, formatPrice } from '../utils/format';
import {
  DELIVERY_LABEL,
  ORDER_STATUS_BADGE,
  ORDER_STATUS_LABEL,
  PAYMENT_LABEL,
  PAYMENT_STATUS_LABEL,
} from '../utils/order-labels';

function OrderDetailsPage(): ReactElement {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const order = useAppSelector(getCurrentOrder);
  const isLoading = useAppSelector(getOrdersLoading);

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  if (isLoading || !order) {
    return <Loader />;
  }

  const a = order.delivery.address;
  const addressLine =
    order.delivery.type === DeliveryType.Pickup
      ? 'Самовывоз'
      : a
      ? [a.region, a.city, a.street, a.house, a.apartment, a.postalCode].filter(Boolean).join(', ')
      : '';

  return (
    <>
      <BreadcrumbComponent
        title={`Заказ ${order.orderNumber}`}
        links={[
          { title: 'Главная', href: AppRoute.Main },
          { title: 'Мои заказы', href: AppRoute.Orders },
        ]}
        pageName={order.orderNumber}
      />
      <div className="container my-5">
        <div className="d-flex align-items-center justify-content-between mb-4 flex-wrap gap-2">
          <div>
            <h3 className="mb-1">Заказ {order.orderNumber}</h3>
            <p className="text-muted mb-0">от {formatDate(order.createdAt)}</p>
          </div>
          <span className={`badge ${ORDER_STATUS_BADGE[order.status]} fs-6`}>
            {ORDER_STATUS_LABEL[order.status]}
          </span>
        </div>

        <div className="row">
          <div className="col-lg-8">
            <table className="table">
              <thead>
                <tr>
                  <th></th>
                  <th>Товар</th>
                  <th>Цена</th>
                  <th>Кол-во</th>
                  <th>Сумма</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item) => (
                  <tr key={item.productId}>
                    <td style={{ width: 80 }}>
                      <img
                        src={item.imageUrl || DEFAULT_PRODUCT_IMG}
                        alt={item.title}
                        style={{ width: 60, height: 60, objectFit: 'cover' }}
                      />
                    </td>
                    <td>{item.title}</td>
                    <td>{formatPrice(item.price)}</td>
                    <td>{item.quantity}</td>
                    <td>{formatPrice(item.price * item.quantity)}</td>
                  </tr>
                ))}
              </tbody>
            </table>

            <h5 className="mt-4">История статусов</h5>
            <ul className="list-group">
              {order.statusHistory.map((entry, idx) => (
                <li key={idx} className="list-group-item d-flex justify-content-between">
                  <span>
                    <strong>{ORDER_STATUS_LABEL[entry.status]}</strong>
                    {entry.comment && <span className="text-muted"> — {entry.comment}</span>}
                  </span>
                  <span className="text-muted">{formatDate(entry.changedAt)}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="col-lg-4">
            <div className="border rounded p-3 mb-3">
              <h6>Контакты</h6>
              <div>{order.contact.name}</div>
              <div>{order.contact.phone}</div>
              <div>{order.contact.email}</div>
            </div>

            <div className="border rounded p-3 mb-3">
              <h6>Доставка</h6>
              <div>{DELIVERY_LABEL[order.delivery.type]}</div>
              {addressLine && <div className="text-muted small">{addressLine}</div>}
              {order.delivery.cost ? (
                <div className="mt-1">Стоимость: {formatPrice(order.delivery.cost)}</div>
              ) : null}
              {order.delivery.trackingNumber && (
                <div className="mt-1">Трек: {order.delivery.trackingNumber}</div>
              )}
            </div>

            <div className="border rounded p-3 mb-3">
              <h6>Оплата</h6>
              <div>{PAYMENT_LABEL[order.payment.method]}</div>
              <div className="text-muted small">{PAYMENT_STATUS_LABEL[order.payment.status]}</div>
              {[PaymentMethod.FreedomPay, PaymentMethod.KaspiPay, PaymentMethod.HalykEpay].includes(
                order.payment.method,
              ) &&
                order.payment.status !== PaymentStatus.Paid && (
                  <button
                    type="button"
                    className="btn btn-primary mt-2 w-100"
                    onClick={async () => {
                      const result = await dispatch(initPayment(order.id)).unwrap();
                      if (result?.redirectUrl) {
                        window.location.href = result.redirectUrl;
                      }
                    }}
                  >
                    Оплатить сейчас
                  </button>
                )}
            </div>

            <div className="border rounded p-3">
              <h6>Итого</h6>
              <div className="fs-5">
                <strong>{formatPrice(order.totalPrice)}</strong>
              </div>
            </div>

            <div className="mt-4">
              <Link to={AppRoute.Orders} className="btn btn-outline-secondary">
                ← К списку заказов
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default OrderDetailsPage;
