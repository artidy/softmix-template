import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { Order, OrdersQuery, OrderStatus } from '@project-lib/shared-types';

import { OrderEntity } from './order.entity';
import { OrderModel } from './order.model';

@Injectable()
export class OrderRepository {
  constructor(
    @InjectModel(OrderModel.name) private readonly orderModel: Model<OrderModel>,
  ) {}

  public async create(order: OrderEntity): Promise<Order> {
    const document = new this.orderModel(order.toObject());
    const saved = await document.save();
    return this.documentToOrder(saved);
  }

  public async findById(id: string): Promise<Order | null> {
    const document = await this.orderModel.findById(id).exec();
    return document ? this.documentToOrder(document) : null;
  }

  public async findByOrderNumber(orderNumber: string): Promise<Order | null> {
    const document = await this.orderModel.findOne({ orderNumber }).exec();
    return document ? this.documentToOrder(document) : null;
  }

  public async update(id: string, order: OrderEntity): Promise<Order | null> {
    const document = await this.orderModel
      .findByIdAndUpdate(id, order.toObject(), { new: true })
      .exec();
    return document ? this.documentToOrder(document) : null;
  }

  public async findUserOrders(
    userId: string,
    query: OrdersQuery,
  ): Promise<{ orders: Order[]; total: number }> {
    const filter: FilterQuery<OrderModel> = { userId };

    if (query.status) {
      filter.status = query.status;
    }

    return this.find(filter, query);
  }

  public async findAll(query: OrdersQuery): Promise<{ orders: Order[]; total: number }> {
    const filter: FilterQuery<OrderModel> = {};

    if (query.status) {
      filter.status = query.status;
    }

    if (query.userId) {
      filter.userId = query.userId;
    }

    if (query.search) {
      filter.$or = [
        { orderNumber: { $regex: query.search, $options: 'i' } },
        { 'contact.phone': { $regex: query.search, $options: 'i' } },
        { 'contact.name': { $regex: query.search, $options: 'i' } },
        { 'contact.email': { $regex: query.search, $options: 'i' } },
      ];
    }

    if (query.dateFrom || query.dateTo) {
      filter.createdAt = {};
      if (query.dateFrom) {
        filter.createdAt.$gte = new Date(query.dateFrom);
      }
      if (query.dateTo) {
        filter.createdAt.$lte = new Date(query.dateTo);
      }
    }

    return this.find(filter, query);
  }

  public async countByStatus(status: OrderStatus): Promise<number> {
    return this.orderModel.countDocuments({ status }).exec();
  }

  private async find(
    filter: FilterQuery<OrderModel>,
    query: OrdersQuery,
  ): Promise<{ orders: Order[]; total: number }> {
    const page = Math.max(1, query.page ?? 1);
    const limit = Math.max(1, Math.min(100, query.limit ?? 20));
    const skip = (page - 1) * limit;

    const [documents, total] = await Promise.all([
      this.orderModel
        .find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .exec(),
      this.orderModel.countDocuments(filter).exec(),
    ]);

    return {
      orders: documents.map((d) => this.documentToOrder(d)),
      total,
    };
  }

  private documentToOrder(document: OrderModel): Order {
    return {
      _id: document._id.toString(),
      orderNumber: document.orderNumber,
      userId: document.userId,
      items: document.items,
      totalItems: document.totalItems,
      totalPrice: document.totalPrice,
      currency: document.currency,
      status: document.status,
      contact: document.contact,
      delivery: document.delivery,
      payment: document.payment,
      comment: document.comment,
      statusHistory: document.statusHistory,
      createdAt: document.createdAt,
      updatedAt: document.updatedAt,
    };
  }
}
