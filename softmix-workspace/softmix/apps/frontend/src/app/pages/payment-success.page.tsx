import { useEffect, useMemo } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CircleCheck } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { useDocumentTitle } from '../lib/use-document-title';
import { fetchMyOrders, fetchOrderById } from '../store/orders-data/api-actions';
import { getCurrentOrder, getOrders, getOrdersLoading } from '../store/orders-data/selectors';
import { formatPrice } from '../utils/format';
import {
  ORDER_STATUS_BADGE,
  ORDER_STATUS_LABEL,
  PAYMENT_STATUS_BADGE,
  PAYMENT_STATUS_LABEL,
} from '../utils/order-labels';
import { OrderFacts, OrderResult } from '../components/order/order-result';
import { Badge } from '../ui/badge';
import { buttonVariants } from '../ui/button';
import { PageLoader } from '../ui/feedback';

function PaymentSuccessPage() {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const orderNumber = params.get('order');
  const orderId = params.get('id');
  const orders = useAppSelector(getOrders);
  const current = useAppSelector(getCurrentOrder);
  const isLoading = useAppSelector(getOrdersLoading);

  useDocumentTitle('Оплата получена');

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
      return orders.find((item) => item.orderNumber === orderNumber) ?? null;
    }
    return null;
  }, [current, orders, orderId, orderNumber]);

  // Платёжный шлюз возвращает только номер заказа — дозагружаем заказ целиком со свежим статусом оплаты.
  useEffect(() => {
    if (order && order.id !== current?.id) {
      dispatch(fetchOrderById(order.id));
    }
  }, [dispatch, order, current?.id]);

  if (isLoading || !order) {
    return <PageLoader />;
  }

  return (
    <OrderResult
      tone="success"
      icon={<CircleCheck />}
      title="Спасибо! Платёж обрабатывается"
      lead={
        <>
          Заказ <span className="font-semibold text-foreground">{order.orderNumber}</span> на сумму{' '}
          <span className="font-semibold tabular-nums text-foreground">{formatPrice(order.totalPrice)}</span>.
        </>
      }
      actions={
        <>
          <Link to={`${AppRoute.Orders}/${order.id}`} className={buttonVariants()}>
            Открыть заказ
          </Link>
          <Link to={AppRoute.Shop} className={buttonVariants({ variant: 'outline' })}>
            Продолжить покупки
          </Link>
        </>
      }
    >
      <OrderFacts
        items={[
          {
            label: 'Статус заказа',
            value: <Badge variant={ORDER_STATUS_BADGE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>,
          },
          {
            label: 'Статус оплаты',
            value: (
              <Badge variant={PAYMENT_STATUS_BADGE[order.payment.status]}>{PAYMENT_STATUS_LABEL[order.payment.status]}</Badge>
            ),
          },
        ]}
      />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Если статус ещё «Ожидает оплаты», обновите страницу через минуту — банк передаёт подтверждение асинхронно.
      </p>
    </OrderResult>
  );
}

export default PaymentSuccessPage;
