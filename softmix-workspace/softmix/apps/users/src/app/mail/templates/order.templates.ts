import {
  DeliveryType,
  OrderApi,
  OrderStatus,
  PaymentMethod,
} from '@project-lib/shared-types';

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
  [PaymentMethod.CashOnDelivery]: 'Оплата при получении',
  [PaymentMethod.BankTransfer]: 'Банковский перевод',
  [PaymentMethod.KaspiPay]: 'Kaspi Pay',
  [PaymentMethod.HalykEpay]: 'Halyk epay',
  [PaymentMethod.FreedomPay]: 'Freedom Pay',
};

function escape(value: string | number | undefined | null): string {
  if (value === undefined || value === null) return '';
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function formatPrice(value: number): string {
  return `${value.toLocaleString('ru-RU')} ₸`;
}

function renderItems(order: OrderApi): string {
  const rows = order.items
    .map(
      (item) => `
      <tr>
        <td style="padding:8px;border-bottom:1px solid #eee;">${escape(item.title)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:center;">${item.quantity}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatPrice(item.price)}</td>
        <td style="padding:8px;border-bottom:1px solid #eee;text-align:right;">${formatPrice(item.price * item.quantity)}</td>
      </tr>`,
    )
    .join('');

  return `
    <table style="width:100%;border-collapse:collapse;margin-top:12px;">
      <thead>
        <tr style="background:#f6f6f6;">
          <th style="padding:8px;text-align:left;">Товар</th>
          <th style="padding:8px;text-align:center;">Кол-во</th>
          <th style="padding:8px;text-align:right;">Цена</th>
          <th style="padding:8px;text-align:right;">Сумма</th>
        </tr>
      </thead>
      <tbody>${rows}</tbody>
    </table>`;
}

function renderAddress(order: OrderApi): string {
  if (order.delivery.type === DeliveryType.Pickup) {
    return 'Самовывоз';
  }
  const a = order.delivery.address;
  if (!a) return '';
  return [a.region, a.city, a.street, a.house, a.apartment, a.postalCode]
    .filter(Boolean)
    .map((v) => escape(v))
    .join(', ');
}

export function renderOrderCreatedHtml(
  order: OrderApi,
  shopName: string,
  isAdmin = false,
): string {
  const greeting = isAdmin
    ? `<p>Получен новый заказ <strong>${escape(order.orderNumber)}</strong>.</p>`
    : `<p>Здравствуйте, ${escape(order.contact.name)}!</p>
       <p>Спасибо за заказ в магазине <strong>${escape(shopName)}</strong>. Ваш заказ <strong>${escape(order.orderNumber)}</strong> принят и обрабатывается.</p>`;

  return `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#333;">
    ${greeting}
    ${renderItems(order)}
    <p style="margin-top:16px;font-size:16px;"><strong>Итого: ${formatPrice(order.totalPrice)}</strong></p>
    <h3>Доставка</h3>
    <p>Способ: ${escape(DELIVERY_LABELS[order.delivery.type])}<br/>
    Адрес: ${renderAddress(order)}</p>
    <h3>Оплата</h3>
    <p>${escape(PAYMENT_LABELS[order.payment.method])}</p>
    <h3>Контакты</h3>
    <p>${escape(order.contact.name)}<br/>${escape(order.contact.phone)}<br/>${escape(order.contact.email)}</p>
    ${order.comment ? `<h3>Комментарий</h3><p>${escape(order.comment)}</p>` : ''}
  </div>`;
}

export function renderOrderStatusChangedHtml(
  order: OrderApi,
  previousStatus: OrderStatus,
  shopName: string,
): string {
  return `
  <div style="font-family:Arial,sans-serif;max-width:640px;margin:0 auto;color:#333;">
    <p>Здравствуйте, ${escape(order.contact.name)}!</p>
    <p>Статус вашего заказа <strong>${escape(order.orderNumber)}</strong> в магазине <strong>${escape(shopName)}</strong> изменён:</p>
    <p><span style="color:#888;">${escape(STATUS_LABELS[previousStatus])}</span> &rarr;
       <strong>${escape(STATUS_LABELS[order.status])}</strong></p>
    <p>Сумма заказа: ${formatPrice(order.totalPrice)}</p>
  </div>`;
}
