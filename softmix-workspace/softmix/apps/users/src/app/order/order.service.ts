import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import {
  CartItem,
  Currency,
  OrderApi,
  OrderStatus,
  OrdersPaginationApi,
  OrdersQuery,
  PaymentStatus,
  UserRole,
} from '@project-lib/shared-types';

import { CartService } from '../cart/cart.service';
import { UserService } from '../user/user.service';
import { NotificationService } from '../notifications/notification.service';
import { CheckoutDto } from './dto/checkout.dto';
import { UpdateOrderStatusDto } from './dto/update-order-status.dto';
import { OrderEntity } from './order.entity';
import { OrderRepository } from './order.repository';

@Injectable()
export class OrderService {
  constructor(
    private readonly orderRepository: OrderRepository,
    private readonly cartService: CartService,
    private readonly userService: UserService,
    private readonly notificationService: NotificationService,
  ) {}

  public async checkout(userId: string, dto: CheckoutDto): Promise<OrderApi> {
    const cart = await this.cartService.getCart(userId);

    if (!cart.items || cart.items.length === 0) {
      throw new BadRequestException('Корзина пуста — нечего оформлять');
    }

    const items: CartItem[] = cart.items
      .map<CartItem | null>((item) => {
        const price = Number(item.price);
        const quantity = Math.max(1, Math.round(Number(item.quantity)));
        if (!Number.isFinite(price) || price < 0 || !Number.isFinite(quantity)) {
          return null;
        }
        return {
          productId: item.productId,
          title: item.title,
          price,
          quantity,
          imageUrl: item.imageUrl,
        };
      })
      .filter((item): item is CartItem => item !== null);

    if (items.length === 0) {
      throw new BadRequestException('В корзине нет товаров с корректной ценой');
    }

    const totalItems = items.reduce((sum, item) => sum + item.quantity, 0);
    const deliveryCost = Number.isFinite(Number(dto.delivery.cost))
      ? Number(dto.delivery.cost)
      : 0;
    const totalPrice =
      items.reduce((sum, item) => sum + item.price * item.quantity, 0) + deliveryCost;

    const orderNumber = await this.generateOrderNumber();
    const now = new Date();

    const entity = new OrderEntity({
      orderNumber,
      userId,
      items,
      totalItems,
      totalPrice,
      currency: Currency.KZT,
      status: OrderStatus.Pending,
      contact: dto.contact,
      delivery: dto.delivery,
      payment: {
        method: dto.payment.method,
        status: PaymentStatus.Pending,
      },
      comment: dto.comment,
      statusHistory: [
        {
          status: OrderStatus.Pending,
          changedAt: now,
          changedBy: userId,
          comment: 'Заказ создан',
        },
      ],
    });

    const created = await this.orderRepository.create(entity);
    await this.cartService.clearCart(userId);

    const apiOrder = new OrderEntity(created).toApi();
    this.notificationService.notifyOrderCreated(apiOrder);

    return apiOrder;
  }

  public async getUserOrders(userId: string, query: OrdersQuery): Promise<OrdersPaginationApi> {
    const { orders, total } = await this.orderRepository.findUserOrders(userId, query);
    return {
      orders: orders.map((order) => new OrderEntity(order).toApi()),
      total,
    };
  }

  public async getOrderForUser(userId: string, id: string, role: UserRole): Promise<OrderApi> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    const isOwner = order.userId === userId;
    const isStaff = role === UserRole.Admin || role === UserRole.Manager;

    if (!isOwner && !isStaff) {
      throw new ForbiddenException('Нет доступа к этому заказу');
    }

    return new OrderEntity(order).toApi();
  }

  public async getAllOrders(query: OrdersQuery): Promise<OrdersPaginationApi> {
    const { orders, total } = await this.orderRepository.findAll(query);
    return {
      orders: orders.map((order) => new OrderEntity(order).toApi()),
      total,
    };
  }

  public async updateStatus(
    id: string,
    dto: UpdateOrderStatusDto,
    changedBy: string,
  ): Promise<OrderApi> {
    const order = await this.orderRepository.findById(id);

    if (!order) {
      throw new NotFoundException('Заказ не найден');
    }

    const entity = new OrderEntity(order);
    const previousStatus = entity.status;
    entity.changeStatus(dto.status, changedBy, dto.comment);

    const updated = await this.orderRepository.update(id, entity);

    if (!updated) {
      throw new NotFoundException('Не удалось обновить заказ');
    }

    const apiOrder = new OrderEntity(updated).toApi();

    if (previousStatus !== dto.status) {
      this.notificationService.notifyOrderStatusChanged(apiOrder, previousStatus);
    }

    return apiOrder;
  }

  private async generateOrderNumber(): Promise<string> {
    const date = new Date();
    const yyyy = date.getFullYear();
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const dd = String(date.getDate()).padStart(2, '0');
    const datePart = `${yyyy}${mm}${dd}`;

    for (let attempt = 0; attempt < 5; attempt++) {
      const random = Math.floor(1000 + Math.random() * 9000);
      const candidate = `SM-${datePart}-${random}`;
      const exists = await this.orderRepository.findByOrderNumber(candidate);
      if (!exists) {
        return candidate;
      }
    }

    return `SM-${datePart}-${Date.now()}`;
  }
}
