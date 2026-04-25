import { DeliveryType, OrderApi, OrderStatus, PaymentMethod } from '@project-lib/shared-types';

const STATUS_LABELS: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Принят',
  [OrderStatus.Paid]: 'Оплачен',
  [OrderStatus.Processing]: 'В обработке',
  [OrderStatus.Shipped]: 'Отправлен',
  [OrderStatus.Delivered]: 'Доставлен',
  [OrderStatus.Cancelled]: 'Отменён',
};

const DELIVERY_LABELS: Record<DeliveryType, string> = {
  [DeliveryType.Pickup]: 'Самовывоз',
  [DeliveryType.Courier]: 'Курьер',
  [DeliveryType.KazPost]: 'Казпочта',
  [DeliveryType.Sdek]: 'СДЭК',
};

const PAYMENT_LABELS: Record<PaymentMethod, string> = {
  [PaymentMethod.CashOnDelivery]: 'При получении',
  [PaymentMethod.BankTransfer]: 'Банковский перевод',
  [PaymentMethod.KaspiPay]: 'Kaspi Pay',
  [PaymentMethod.HalykEpay]: 'Halyk epay',
  [PaymentMethod.FreedomPay]: 'Freedom Pay',
};

export function statusLabel(status: OrderStatus): string {
  return STATUS_LABELS[status];
}

export function deliveryLabel(type: DeliveryType): string {
  return DELIVERY_LABELS[type];
}

export function paymentLabel(method: PaymentMethod): string {
  return PAYMENT_LABELS[method];
}

export function formatPrice(value: number): string {
  return `${Math.round(value).toLocaleString('ru-RU')} ₸`;
}

export function customerOrderCreatedText(order: OrderApi, shopName: string): string {
  return [
    `${shopName}: заказ ${order.orderNumber} принят.`,
    `Сумма: ${formatPrice(order.totalPrice)}.`,
    `Доставка: ${deliveryLabel(order.delivery.type)}.`,
    `Оплата: ${paymentLabel(order.payment.method)}.`,
    `Статус: ${statusLabel(order.status)}.`,
  ].join('\n');
}

export function customerOrderStatusChangedText(
  order: OrderApi,
  previousStatus: OrderStatus,
  shopName: string,
): string {
  return [
    `${shopName}: заказ ${order.orderNumber} — статус изменён.`,
    `${statusLabel(previousStatus)} → ${statusLabel(order.status)}.`,
    order.delivery.trackingNumber ? `Трек: ${order.delivery.trackingNumber}.` : '',
  ]
    .filter(Boolean)
    .join('\n');
}

export function adminOrderCreatedText(order: OrderApi): string {
  return [
    `🛒 Новый заказ ${order.orderNumber}`,
    `Сумма: ${formatPrice(order.totalPrice)}`,
    `Клиент: ${order.contact.name}, ${order.contact.phone}, ${order.contact.email}`,
    `Доставка: ${deliveryLabel(order.delivery.type)}`,
    `Оплата: ${paymentLabel(order.payment.method)}`,
    `Позиций: ${order.totalItems}`,
    order.comment ? `Комментарий: ${order.comment}` : '',
  ]
    .filter(Boolean)
    .join('\n');
}
