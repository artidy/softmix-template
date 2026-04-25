import { DeliveryType, OrderStatus, PaymentMethod, PaymentStatus } from '@project-lib/shared-types';

export const ORDER_STATUS_LABEL: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'Принят',
  [OrderStatus.Paid]: 'Оплачен',
  [OrderStatus.Processing]: 'В обработке',
  [OrderStatus.Shipped]: 'Отправлен',
  [OrderStatus.Delivered]: 'Доставлен',
  [OrderStatus.Cancelled]: 'Отменён',
};

export const ORDER_STATUS_BADGE: Record<OrderStatus, string> = {
  [OrderStatus.Pending]: 'bg-secondary',
  [OrderStatus.Paid]: 'bg-info',
  [OrderStatus.Processing]: 'bg-primary',
  [OrderStatus.Shipped]: 'bg-warning text-dark',
  [OrderStatus.Delivered]: 'bg-success',
  [OrderStatus.Cancelled]: 'bg-danger',
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
