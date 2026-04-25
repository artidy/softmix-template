import { OrderApi } from '@project-lib/shared-types';
import { Order } from '../../types/order';

export const orderAdapt = (order: OrderApi): Order => ({
  id: order.id,
  orderNumber: order.orderNumber,
  userId: order.userId,
  items: order.items,
  totalItems: order.totalItems,
  totalPrice: order.totalPrice,
  currency: order.currency,
  status: order.status,
  contact: order.contact,
  delivery: order.delivery,
  payment: order.payment,
  comment: order.comment,
  statusHistory: order.statusHistory,
  createdAt: new Date(order.createdAt),
  updatedAt: new Date(order.updatedAt),
});

export const ordersAdapt = (orders: OrderApi[]): Order[] => orders.map(orderAdapt);
