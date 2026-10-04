import { DeliveryType, OrderDelivery, OrderStatus, PaymentMethod, PaymentStatus } from '@project-lib/shared-types';

import { BadgeVariant } from '../ui/badge';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Принят',
  [OrderStatus.Paid]: 'Оплачен',
  [OrderStatus.Processing]: 'В обработке',
  [OrderStatus.Shipped]: 'Отправлен',
  [OrderStatus.Delivered]: 'Доставлен',
  [OrderStatus.Cancelled]: 'Отменён',
};

export const ORDER_STATUS_BADGE: Record<OrderStatus, BadgeVariant> = {
  [OrderStatus.Pending]: 'neutral',
  [OrderStatus.Paid]: 'primary',
  [OrderStatus.Processing]: 'highlight',
  [OrderStatus.Shipped]: 'warning',
  [OrderStatus.Delivered]: 'success',
  [OrderStatus.Cancelled]: 'destructive',
};

export const DELIVERY_LABEL: Record<DeliveryType, string> = {
  [DeliveryType.Pickup]: 'Самовывоз',
  [DeliveryType.Courier]: 'Курьер',
  [DeliveryType.KazPost]: 'Казпочта',
  [DeliveryType.Sdek]: 'СДЭК',
};

export const PAYMENT_LABEL: Record<PaymentMethod, string> = {
  [PaymentMethod.CashOnDelivery]: 'Оплата при получении',
  [PaymentMethod.BankTransfer]: 'Банковский перевод',
  [PaymentMethod.KaspiPay]: 'Kaspi Pay',
  [PaymentMethod.HalykEpay]: 'Halyk epay',
  [PaymentMethod.FreedomPay]: 'Freedom Pay',
};

export const PAYMENT_STATUS_LABEL: Record<PaymentStatus, string> = {
  [PaymentStatus.Pending]: 'Ожидает оплаты',
  [PaymentStatus.Paid]: 'Оплачен',
  [PaymentStatus.Failed]: 'Ошибка',
  [PaymentStatus.Refunded]: 'Возврат',
};

export const PAYMENT_STATUS_BADGE: Record<PaymentStatus, BadgeVariant> = {
  [PaymentStatus.Pending]: 'warning',
  [PaymentStatus.Paid]: 'success',
  [PaymentStatus.Failed]: 'destructive',
  [PaymentStatus.Refunded]: 'neutral',
};

/** Адрес доставки одной строкой; для самовывоза — «Самовывоз». */
export function formatOrderAddress(delivery: OrderDelivery): string {
  if (delivery.type === DeliveryType.Pickup) {
    return 'Самовывоз';
  }
  const address = delivery.address;
  return address
    ? [address.region, address.city, address.street, address.house, address.apartment, address.postalCode]
        .filter(Boolean)
        .join(', ')
    : '';
}
