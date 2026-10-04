import { useEffect, useMemo, useState } from 'react';
import { Link, useSearchParams } from 'react-router';
import { CircleX } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { useDocumentTitle } from '../lib/use-document-title';
import { fetchMyOrders } from '../store/orders-data/api-actions';
import { initPayment } from '../store/orders-data/payment-actions';
import { getOrders, getOrdersLoading } from '../store/orders-data/selectors';
import { formatPrice } from '../utils/format';
import { OrderResult } from '../components/order/order-result';
import { Button, buttonVariants } from '../ui/button';
import { PageLoader } from '../ui/feedback';

function PaymentFailedPage() {
  const dispatch = useAppDispatch();
  const [params] = useSearchParams();
  const orderNumber = params.get('order');
  const orders = useAppSelector(getOrders);
  const isLoading = useAppSelector(getOrdersLoading);
  const [isRetrying, setIsRetrying] = useState(false);

  useDocumentTitle('Не удалось оплатить');

  useEffect(() => {
    dispatch(fetchMyOrders(undefined));
  }, [dispatch]);

  const order = useMemo(
    () => (orderNumber ? orders.find((item) => item.orderNumber === orderNumber) ?? null : null),
    [orders, orderNumber],
  );

  const retry = async () => {
    if (!order) {
      return;
    }
    setIsRetrying(true);
    const result = await dispatch(initPayment(order.id)).unwrap();
    if (result?.redirectUrl) {
      window.location.href = result.redirectUrl;
      return;
    }
    setIsRetrying(false);
  };

  if (isLoading) {
    return <PageLoader />;
  }

  return (
    <OrderResult
      tone="error"
      icon={<CircleX />}
      title="Платёж не прошёл"
      lead={
        order ? (
          <>
            Заказ <span className="font-semibold text-foreground">{order.orderNumber}</span> на сумму{' '}
            <span className="font-semibold tabular-nums text-foreground">{formatPrice(order.totalPrice)}</span> не оплачен.
          </>
        ) : (
          'Платёж не прошёл. Попробуйте ещё раз или выберите другой способ оплаты.'
        )
      }
      actions={
        <>
          {order && (
            <Button onClick={retry} loading={isRetrying}>
              Попробовать снова
            </Button>
          )}
          <Link to={AppRoute.Orders} className={buttonVariants({ variant: 'outline' })}>
            Мои заказы
          </Link>
        </>
      }
    />
  );
}

export default PaymentFailedPage;
