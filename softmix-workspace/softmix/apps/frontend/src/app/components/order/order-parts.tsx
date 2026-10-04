import { ReactNode } from 'react';
import { Link } from 'react-router';

import { Order } from '../../types/order';
import { AppRoute, DEFAULT_PRODUCT_IMG } from '../../const';
import { cn } from '../../lib/cn';
import { formatDate, formatPrice } from '../../utils/format';
import {
  DELIVERY_LABEL,
  formatOrderAddress,
  ORDER_STATUS_BADGE,
  ORDER_STATUS_LABEL,
  PAYMENT_LABEL,
  PAYMENT_STATUS_BADGE,
  PAYMENT_STATUS_LABEL,
} from '../../utils/order-labels';
import { Badge } from '../../ui/badge';
import { Card } from '../../ui/card';

export function OrderStatusBadge({ order, className }: { order: Order; className?: string }) {
  return (
    <Badge variant={ORDER_STATUS_BADGE[order.status]} className={className}>
      {ORDER_STATUS_LABEL[order.status]}
    </Badge>
  );
}

/** Раздел боковой колонки заказа: «Контакты», «Доставка», «Оплата». */
export function OrderInfoCard({ title, children, className }: { title: string; children: ReactNode; className?: string }) {
  return (
    <Card className={cn('p-5', className)}>
      <h2 className="mb-3 text-xs font-semibold uppercase tracking-[0.12em] text-muted-foreground">{title}</h2>
      <div className="grid gap-1 text-sm">{children}</div>
    </Card>
  );
}

export function OrderItemsCard({ order }: { order: Order }) {
  return (
    <Card>
      <div className="flex items-center justify-between gap-4 border-b px-5 py-4">
        <h2 className="font-semibold">Состав заказа</h2>
        <span className="text-sm text-muted-foreground">{order.totalItems} шт.</span>
      </div>
      <ul className="divide-y">
        {order.items.map((item) => (
          <li key={item.productId} className="flex items-center gap-4 px-5 py-4">
            <Link
              to={`${AppRoute.Shop}/${item.productId}`}
              className="grid size-16 shrink-0 place-items-center overflow-hidden rounded-xl border bg-white p-1.5"
            >
              <img src={item.imageUrl || DEFAULT_PRODUCT_IMG} alt="" loading="lazy" className="size-full object-contain" />
            </Link>
            <div className="min-w-0 flex-1">
              <Link
                to={`${AppRoute.Shop}/${item.productId}`}
                className="line-clamp-2 text-sm font-medium leading-snug transition-colors hover:text-primary"
              >
                {item.title}
              </Link>
              <p className="mt-1 text-sm tabular-nums text-muted-foreground">
                {formatPrice(item.price)} × {item.quantity}
              </p>
            </div>
            <span className="shrink-0 font-semibold tabular-nums">{formatPrice(item.price * item.quantity)}</span>
          </li>
        ))}
      </ul>
      <div className="flex items-baseline justify-between gap-4 border-t px-5 py-4">
        <span className="text-sm text-muted-foreground">Итого</span>
        <span className="text-xl font-semibold tabular-nums">{formatPrice(order.totalPrice)}</span>
      </div>
    </Card>
  );
}

export function OrderTimeline({ order }: { order: Order }) {
  // Свежие события сверху.
  const history = [...order.statusHistory].reverse();

  return (
    <Card className="p-5">
      <h2 className="mb-4 font-semibold">История статусов</h2>
      <ol className="relative grid gap-5 border-l pl-6">
        {history.map((entry, index) => (
          <li key={index} className="relative">
            <span
              className={cn(
                'absolute -left-[1.86rem] top-1 size-3 rounded-full border-2 border-card',
                index === 0 ? 'bg-primary' : 'bg-muted-foreground/40',
              )}
              aria-hidden="true"
            />
            <div className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1">
              <span className="font-medium">{ORDER_STATUS_LABEL[entry.status]}</span>
              <time className="text-xs tabular-nums text-muted-foreground">{formatDate(entry.changedAt)}</time>
            </div>
            {entry.comment && <p className="mt-1 text-sm text-muted-foreground">{entry.comment}</p>}
          </li>
        ))}
      </ol>
    </Card>
  );
}

type OrderSideInfoProps = {
  order: Order;
  /** В админке контакты кликабельные: позвонить или написать клиенту. */
  linkContacts?: boolean;
  paymentAction?: ReactNode;
};

export function OrderSideInfo({ order, linkContacts = false, paymentAction }: OrderSideInfoProps) {
  const address = formatOrderAddress(order.delivery);

  return (
    <>
      <OrderInfoCard title={linkContacts ? 'Клиент' : 'Контакты'}>
        <p className="font-medium">{order.contact.name}</p>
        {linkContacts ? (
          <>
            <a href={`tel:${order.contact.phone}`} className="text-primary hover:underline">
              {order.contact.phone}
            </a>
            <a href={`mailto:${order.contact.email}`} className="break-all text-primary hover:underline">
              {order.contact.email}
            </a>
          </>
        ) : (
          <>
            <p>{order.contact.phone}</p>
            <p className="break-all">{order.contact.email}</p>
          </>
        )}
      </OrderInfoCard>

      <OrderInfoCard title="Доставка">
        <p className="font-medium">{DELIVERY_LABEL[order.delivery.type]}</p>
        {address && address !== DELIVERY_LABEL[order.delivery.type] && <p className="text-muted-foreground">{address}</p>}
        {order.delivery.cost ? <p>Стоимость: {formatPrice(order.delivery.cost)}</p> : null}
        {order.delivery.trackingNumber && <p>Трек: {order.delivery.trackingNumber}</p>}
      </OrderInfoCard>

      <OrderInfoCard title="Оплата">
        <p className="font-medium">{PAYMENT_LABEL[order.payment.method]}</p>
        <div>
          <Badge variant={PAYMENT_STATUS_BADGE[order.payment.status]}>{PAYMENT_STATUS_LABEL[order.payment.status]}</Badge>
        </div>
        {paymentAction && <div className="mt-3">{paymentAction}</div>}
      </OrderInfoCard>
    </>
  );
}
