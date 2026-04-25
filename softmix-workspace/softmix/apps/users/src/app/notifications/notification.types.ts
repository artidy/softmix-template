import { OrderApi, OrderStatus } from '@project-lib/shared-types';

export interface OrderCreatedEvent {
  order: OrderApi;
}

export interface OrderStatusChangedEvent {
  order: OrderApi;
  previousStatus: OrderStatus;
}

export interface CustomerNotificationChannel {
  readonly name: string;
  isAvailable(): boolean;
  notifyOrderCreated(event: OrderCreatedEvent): Promise<void>;
  notifyOrderStatusChanged(event: OrderStatusChangedEvent): Promise<void>;
}

export interface AdminNotificationChannel {
  readonly name: string;
  isAvailable(): boolean;
  notifyAdminOrderCreated(event: OrderCreatedEvent): Promise<void>;
}
