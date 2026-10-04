import { useEffect } from 'react';
import { Link } from 'react-router';
import { ChevronRight, Package } from 'lucide-react';

import { useAppDispatch, useAppSelector } from '../hooks';
import { AppRoute } from '../const';
import { pluralize } from '../lib/format';
import { useDocumentTitle } from '../lib/use-document-title';
import { fetchMyOrders } from '../store/orders-data/api-actions';
import { getOrders, getOrdersLoading } from '../store/orders-data/selectors';
import { formatDate, formatPrice } from '../utils/format';
import { OrderStatusBadge } from '../components/order/order-parts';
import { buttonVariants } from '../ui/button';
import { Card } from '../ui/card';
import { EmptyState, Skeleton } from '../ui/feedback';
import { Container } from '../ui/layout';
import { PageHeader } from '../ui/page-header';

function MyOrdersPage() {
  const dispatch = useAppDispatch();
  const orders = useAppSelector(getOrders);
  const isLoading = useAppSelector(getOrdersLoading);

  useDocumentTitle('Мои заказы');

  useEffect(() => {
    dispatch(fetchMyOrders(undefined));
  }, [dispatch]);

  return (
    <>
      <PageHeader
        title="Мои заказы"
        breadcrumbs={[
          { label: 'Главная', to: AppRoute.Main },
          { label: 'Профиль', to: AppRoute.Profile },
          { label: 'Мои заказы' },
        ]}
      />
      <Container className="py-8 lg:py-10">
        {isLoading && orders.length === 0 ? (
          <Card className="divide-y">
            {Array.from({ length: 4 }, (_, index) => (
              <div key={index} className="flex items-center gap-4 p-5">
                <div className="grid flex-1 gap-2">
                  <Skeleton className="h-4 w-40" />
                  <Skeleton className="h-3 w-28" />
                </div>
                <Skeleton className="h-6 w-24 rounded-full" />
                <Skeleton className="h-5 w-24" />
              </div>
            ))}
          </Card>
        ) : orders.length === 0 ? (
          <EmptyState
            icon={<Package />}
            title="У вас пока нет заказов"
            action={
              <Link to={AppRoute.Shop} className={buttonVariants()}>
                Перейти в каталог
              </Link>
            }
            className="rounded-2xl border bg-card"
          />
        ) : (
          <Card>
            <ul className="divide-y">
              {orders.map((order) => (
                <li key={order.id}>
                  <Link
                    to={`${AppRoute.Orders}/${order.id}`}
                    className="group flex flex-wrap items-center gap-x-6 gap-y-3 p-5 transition-colors hover:bg-accent/60"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-semibold">Заказ {order.orderNumber}</p>
                      <p className="mt-0.5 text-sm text-muted-foreground">
                        {formatDate(order.createdAt)} · {order.totalItems}{' '}
                        {pluralize(order.totalItems, ['товар', 'товара', 'товаров'])}
                      </p>
                    </div>
                    <OrderStatusBadge order={order} />
                    <span className="w-28 text-right font-semibold tabular-nums">{formatPrice(order.totalPrice)}</span>
                    <ChevronRight
                      className="size-5 text-muted-foreground transition-transform group-hover:translate-x-0.5"
                      aria-hidden="true"
                    />
                  </Link>
                </li>
              ))}
            </ul>
          </Card>
        )}
      </Container>
    </>
  );
}

export default MyOrdersPage;
