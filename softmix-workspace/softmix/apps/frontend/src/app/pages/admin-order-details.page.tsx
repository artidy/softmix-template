import { ChangeEvent, ReactElement, useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { DeliveryType, OrderStatus } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute, DEFAULT_PRODUCT_IMG } from '../const';
import { fetchOrderById, updateOrderStatus } from '../store/orders-data/api-actions';
import { getCurrentOrder, getOrdersLoading } from '../store/orders-data/selectors';
import Loader from '../components/loader/loader.component';
import { formatDate, formatPrice } from '../utils/format';
import {
  DELIVERY_LABEL,
  ORDER_STATUS_BADGE,
  ORDER_STATUS_LABEL,
  PAYMENT_LABEL,
  PAYMENT_STATUS_LABEL,
} from '../utils/order-labels';

function AdminOrderDetailsPage(): ReactElement {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const order = useAppSelector(getCurrentOrder);
  const isLoading = useAppSelector(getOrdersLoading);

  const [nextStatus, setNextStatus] = useState<OrderStatus | ''>('');
  const [comment, setComment] = useState('');

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  useEffect(() => {
    if (order) {
      setNextStatus(order.status);
    }
  }, [order]);

  if (isLoading || !order) {
    return <Loader />;
  }

  const handleStatusChange = (evt: ChangeEvent<HTMLSelectElement>) => {
    setNextStatus(evt.target.value as OrderStatus);
  };

  const handleSave = () => {
    if (!nextStatus || nextStatus === order.status) {
      return;
    }
    dispatch(updateOrderStatus({ id: order.id, dto: { status: nextStatus, comment: comment.trim() || undefined } }));
    setComment('');
  };

  const a = order.delivery.address;
  const addressLine =
    order.delivery.type === DeliveryType.Pickup
      ? 'Самовывоз'
      : a
      ? [a.region, a.city, a.street, a.house, a.apartment, a.postalCode].filter(Boolean).join(', ')
      : '';

  return (
    <section>
      <div className="d-flex flex-wrap align-items-center justify-content-between mb-3 gap-2">
        <div>
          <h1 className="mb-1">Заказ {order.orderNumber}</h1>
          <div className="text-muted">от {formatDate(order.createdAt)}</div>
        </div>
        <span className={`badge ${ORDER_STATUS_BADGE[order.status]} fs-6`}>
          {ORDER_STATUS_LABEL[order.status]}
        </span>
      </div>

      <Link to={AppRoute.AdminOrders} className="btn btn-link p-0 mb-3">
        ← К списку заказов
      </Link>

      <div className="row">
        <div className="col-lg-8">
          <h5>Состав заказа</h5>
          <table className="styled-table">
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

          {order.comment && (
            <div className="border rounded p-3 mt-3">
              <h6>Комментарий клиента</h6>
              <p className="mb-0">{order.comment}</p>
            </div>
          )}

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
            <h6>Клиент</h6>
            <div>{order.contact.name}</div>
            <div>
              <a href={`tel:${order.contact.phone}`}>{order.contact.phone}</a>
            </div>
            <div>
              <a href={`mailto:${order.contact.email}`}>{order.contact.email}</a>
            </div>
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
          </div>

          <div className="border rounded p-3 mb-3">
            <h6>Итого</h6>
            <div className="fs-4">
              <strong>{formatPrice(order.totalPrice)}</strong>
            </div>
          </div>

          <div className="border rounded p-3">
            <h6>Сменить статус</h6>
            <div className="mb-2">
              <select className="form-select" value={nextStatus} onChange={handleStatusChange}>
                {Object.values(OrderStatus).map((s) => (
                  <option key={s} value={s}>
                    {ORDER_STATUS_LABEL[s]}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-2">
              <textarea
                rows={2}
                className="form-control"
                placeholder="Комментарий (необязательно)"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <button
              type="button"
              className="btn btn-primary w-100"
              onClick={handleSave}
              disabled={!nextStatus || nextStatus === order.status}
            >
              Сохранить
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}

export default AdminOrderDetailsPage;
