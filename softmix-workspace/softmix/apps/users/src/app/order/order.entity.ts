import {
  CartItem,
  Currency,
  Order,
  OrderApi,
  OrderContact,
  OrderDelivery,
  OrderPayment,
  OrderStatus,
  OrderStatusHistoryItem,
} from '@project-lib/shared-types';

export class OrderEntity implements Order {
  public _id?: string;
  public orderNumber: string;
  public userId: string;
  public items: CartItem[];
  public totalItems: number;
  public totalPrice: number;
  public currency: Currency;
  public status: OrderStatus;
  public contact: OrderContact;
  public delivery: OrderDelivery;
  public payment: OrderPayment;
  public comment?: string;
  public statusHistory: OrderStatusHistoryItem[];
  public createdAt?: Date;
  public updatedAt?: Date;

  constructor(order: Order) {
    this.fillEntity(order);
  }

  public fillEntity(order: Order): void {
    this._id = order._id;
    this.orderNumber = order.orderNumber;
    this.userId = order.userId;
    this.items = order.items || [];
    this.totalItems = order.totalItems;
    this.totalPrice = order.totalPrice;
    this.currency = order.currency;
    this.status = order.status;
    this.contact = order.contact;
    this.delivery = order.delivery;
    this.payment = order.payment;
    this.comment = order.comment;
    this.statusHistory = order.statusHistory || [];
    this.createdAt = order.createdAt;
    this.updatedAt = order.updatedAt;
  }

  public toObject(): Order {
    return {
      _id: this._id,
      orderNumber: this.orderNumber,
      userId: this.userId,
      items: this.items,
      totalItems: this.totalItems,
      totalPrice: this.totalPrice,
      currency: this.currency,
      status: this.status,
      contact: this.contact,
      delivery: this.delivery,
      payment: this.payment,
      comment: this.comment,
      statusHistory: this.statusHistory,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
    };
  }

  public toApi(): OrderApi {
    return {
      id: this._id || '',
      orderNumber: this.orderNumber,
      userId: this.userId,
      items: this.items,
      totalItems: this.totalItems,
      totalPrice: this.totalPrice,
      currency: this.currency,
      status: this.status,
      contact: this.contact,
      delivery: this.delivery,
      payment: this.payment,
      comment: this.comment,
      statusHistory: this.statusHistory,
      createdAt: this.createdAt || new Date(),
      updatedAt: this.updatedAt || new Date(),
    };
  }

  public changeStatus(status: OrderStatus, changedBy?: string, comment?: string): void {
    this.status = status;
    this.statusHistory.push({
      status,
      changedAt: new Date(),
      changedBy,
      comment,
    });
  }
}
