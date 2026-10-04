import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router';
import { ArrowLeft } from 'lucide-react';
import { PaymentMethod, PaymentStatus } from '@project-lib/shared-types';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { useDocumentTitle } from '../lib/use-document-title';
import { fetchOrderById } from '../store/orders-data/api-actions';
import { initPayment } from '../store/orders-data/payment-actions';
import { getCurrentOrder, getOrdersLoading } from '../store/orders-data/selectors';
import { formatDate } from '../utils/format';
import { OrderItemsCard, OrderSideInfo, OrderStatusBadge, OrderTimeline } from '../components/order/order-parts';
import { Button, buttonVariants } from '../ui/button';
import { Card } from '../ui/card';
import { PageLoader } from '../ui/feedback';
import { Container } from '../ui/layout';
import { PageHeader } from '../ui/page-header';

const ONLINE_METHODS: PaymentMethod[] = [PaymentMethod.FreedomPay, PaymentMethod.KaspiPay, PaymentMethod.HalykEpay];

function OrderDetailsPage() {
  const dispatch = useAppDispatch();
  const { id } = useParams();
  const order = useAppSelector(getCurrentOrder);
  const isLoading = useAppSelector(getOrdersLoading);
  const [isPaying, setIsPaying] = useState(false);

  useDocumentTitle(order && order.id === id ? `Заказ ${order.orderNumber}` : 'Заказ');

  useEffect(() => {
    if (id) {
      dispatch(fetchOrderById(id));
    }
  }, [dispatch, id]);

  if (isLoading || !order || order.id !== id) {
    return <PageLoader />;
  }

  const canPay = ONLINE_METHODS.includes(order.payment.method) && order.payment.status !== PaymentStatus.Paid;

  const handlePay = async () => {
    setIsPaying(true);
    const result = await dispatch(initPayment(order.id)).unwrap();
    if (result?.redirectUrl) {
      window.location.href = result.redirectUrl;
      return;
    }
    setIsPaying(false);
  };

  return (
    <>
      <PageHeader
        title={`Заказ ${order.orderNumber}`}
        description={`от ${formatDate(order.createdAt)}`}
        breadcrumbs={[
          { label: 'Главная', to: AppRoute.Main },
          { label: 'Мои заказы', to: AppRoute.Orders },
          { label: order.orderNumber },
        ]}
        actions={<OrderStatusBadge order={order} className="px-3 py-1 text-sm" />}
      />
      <Container className="grid grid-cols-1 items-start gap-6 py-8 lg:grid-cols-[minmax(0,1fr)_22rem] lg:gap-8 lg:py-10">
        <div className="grid gap-6">
          <OrderItemsCard order={order} />
          {order.comment && (
            <Card className="p-5">
              <h2 className="font-semibold">Комментарий к заказу</h2>
              <p className="mt-2 whitespace-pre-line text-sm text-muted-foreground">{order.comment}</p>
            </Card>
          )}
          <OrderTimeline order={order} />
        </div>

        <div className="grid gap-4 lg:sticky lg:top-24">
          <OrderSideInfo
            order={order}
            paymentAction={
              canPay && (
                <Button className="w-full" onClick={handlePay} loading={isPaying}>
                  Оплатить сейчас
                </Button>
              )
            }
          />
          <Link to={AppRoute.Orders} className={buttonVariants({ variant: 'ghost', className: 'justify-self-start' })}>
            <ArrowLeft />
            К списку заказов
          </Link>
        </div>
      </Container>
    </>
  );
}

export default OrderDetailsPage;
