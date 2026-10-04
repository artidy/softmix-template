import { useEffect } from 'react';
import { Link, Navigate, useSearchParams } from 'react-router';
import { CircleCheck } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { useDocumentTitle } from '../lib/use-document-title';
import { fetchOrderById } from '../store/orders-data/api-actions';
import { getCurrentOrder, getOrdersLoading } from '../store/orders-data/selectors';
import { formatPrice } from '../utils/format';
import { ORDER_STATUS_BADGE, ORDER_STATUS_LABEL, PAYMENT_LABEL } from '../utils/order-labels';
import { OrderFacts, OrderResult } from '../components/order/order-result';
import { Badge } from '../ui/badge';
import { buttonVariants } from '../ui/button';
import { PageLoader } from '../ui/feedback';

function CheckoutSuccessPage() {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const orderId = params.get('id');
  const order = useAppSelector(getCurrentOrder);
  const isLoading = useAppSelector(getOrdersLoading);

  useDocumentTitle('Заказ оформлен');

  useEffect(() => {
    if (orderId && (!order || order.id !== orderId)) {
      dispatch(fetchOrderById(orderId));
    }
  }, [dispatch, orderId, order]);

  if (!orderId) {
    return <Navigate to={AppRoute.Orders} replace />;
  }

  if (isLoading || !order || order.id !== orderId) {
    return <PageLoader />;
  }

  return (
    <OrderResult
      tone="success"
      icon={<CircleCheck />}
      title="Спасибо, заказ принят!"
      lead={
        <>
          Номер заказа: <span className="font-semibold text-foreground">{order.orderNumber}</span>
        </>
      }
      actions={
        <>
          <Link to={AppRoute.Orders} className={buttonVariants()}>
            Мои заказы
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
            label: 'Текущий статус',
            value: <Badge variant={ORDER_STATUS_BADGE[order.status]}>{ORDER_STATUS_LABEL[order.status]}</Badge>,
          },
          { label: 'Способ оплаты', value: PAYMENT_LABEL[order.payment.method] },
          { label: 'Сумма к оплате', value: <span className="text-base tabular-nums">{formatPrice(order.totalPrice)}</span> },
        ]}
      />
      <p className="mt-4 text-center text-sm text-muted-foreground">
        Подробности отправлены на {order.contact.email}. Менеджер свяжется с вами по номеру {order.contact.phone}.
      </p>
    </OrderResult>
  );
}

export default CheckoutSuccessPage;
