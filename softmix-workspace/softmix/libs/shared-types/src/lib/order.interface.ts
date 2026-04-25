import { CartItem } from './cart.interface';

export enum OrderStatus {
  Pending = 'pending',
  Paid = 'paid',
  Processing = 'processing',
  Shipped = 'shipped',
  Delivered = 'delivered',
  Cancelled = 'cancelled',
}

export enum DeliveryType {
  Pickup = 'pickup',
  Courier = 'courier',
  KazPost = 'kaz_post',
  Sdek = 'sdek',
}

export enum PaymentMethod {
  CashOnDelivery = 'cash_on_delivery',
  BankTransfer = 'bank_transfer',
  KaspiPay = 'kaspi_pay',
  HalykEpay = 'halyk_epay',
  FreedomPay = 'freedom_pay',
}

export enum PaymentStatus {
  Pending = 'pending',
  Paid = 'paid',
  Failed = 'failed',
  Refunded = 'refunded',
}

export enum Currency {
  KZT = 'KZT',
}

export interface OrderContact {
  name: string;
  phone: string;
  email: string;
}

export interface OrderDeliveryAddress {
  region?: string;
  city: string;
  street?: string;
  house?: string;
  apartment?: string;
  postalCode?: string;
}

export interface OrderDelivery {
  type: DeliveryType;
  address?: OrderDeliveryAddress;
  pickupPointId?: string;
  trackingNumber?: string;
  cost?: number;
}

export interface OrderPayment {
  method: PaymentMethod;
  status: PaymentStatus;
  transactionId?: string;
  paidAt?: Date;
}

export interface OrderStatusHistoryItem {
  status: OrderStatus;
  changedAt: Date;
  changedBy?: string;
  comment?: string;
}

export interface Order {
  _id?: string;
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
  createdAt?: Date;
  updatedAt?: Date;
}

export interface OrderApi {
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
}

export interface OrdersPaginationApi {
  orders: OrderApi[];
  total: number;
}

export interface CheckoutDto {
  contact: OrderContact;
  delivery: OrderDelivery;
  payment: { method: PaymentMethod };
  comment?: string;
}

export interface UpdateOrderStatusDto {
  status: OrderStatus;
  comment?: string;
}

export interface OrdersQuery {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  userId?: string;
  search?: string;
  dateFrom?: string;
  dateTo?: string;
}
