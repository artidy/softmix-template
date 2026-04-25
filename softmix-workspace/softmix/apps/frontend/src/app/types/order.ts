import {
  CartItem,
  Currency,
  DeliveryType,
  OrderApi,
  OrderContact,
  OrderDelivery,
  OrderPayment,
  OrderStatus,
  OrderStatusHistoryItem,
  PaymentMethod,
} from '@project-lib/shared-types';

export type Order = {
  id: string;
  orderNumber: string;
  userId: string;
  items: CartItem[];
  totalItems: number;
  totalPrice: number;
  currency: Currency;
  status: OrderStatus;
  contact: OrderContact;
  delivery: OrderDelivery;
  payment: OrderPayment;
  comment?: string;
  statusHistory: OrderStatusHistoryItem[];
  createdAt: Date;
  updatedAt: Date;
};

export type OrdersState = {
  orders: Order[];
  total: number;
  current: Order | null;
  isLoading: boolean;
  isCheckoutLoading: boolean;
};

export { OrderApi, OrderStatus, DeliveryType, PaymentMethod };
