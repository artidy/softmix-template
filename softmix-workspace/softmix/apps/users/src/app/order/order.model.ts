import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document, Schema as MongooseSchema } from 'mongoose';
import {
  CartItem,
  Currency,
  DeliveryType,
  Order,
  OrderContact,
  OrderDelivery,
  OrderPayment,
  OrderStatus,
  OrderStatusHistoryItem,
  PaymentMethod,
  PaymentStatus,
} from '@project-lib/shared-types';

const ContactSchema = new MongooseSchema(
  {
    name: { type: String, required: true },
    phone: { type: String, required: true },
    email: { type: String, required: true },
  },
  { _id: false },
);

const DeliveryAddressSchema = new MongooseSchema(
  {
    region: { type: String, required: false },
    city: { type: String, required: true },
    street: { type: String, required: false },
    house: { type: String, required: false },
    apartment: { type: String, required: false },
    postalCode: { type: String, required: false },
  },
  { _id: false },
);

const DeliverySchema = new MongooseSchema(
  {
    type: { type: String, enum: Object.values(DeliveryType), required: true },
    address: { type: DeliveryAddressSchema, required: false },
    pickupPointId: { type: String, required: false },
    trackingNumber: { type: String, required: false },
    cost: { type: Number, required: false },
  },
  { _id: false },
);

const PaymentSchema = new MongooseSchema(
  {
    method: { type: String, enum: Object.values(PaymentMethod), required: true },
    status: {
      type: String,
      enum: Object.values(PaymentStatus),
      required: true,
      default: PaymentStatus.Pending,
    },
    transactionId: { type: String, required: false },
    paidAt: { type: Date, required: false },
  },
  { _id: false },
);

const ItemSchema = new MongooseSchema(
  {
    productId: { type: String, required: true },
    title: { type: String, required: true },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    imageUrl: { type: String, required: false },
  },
  { _id: false },
);

const StatusHistorySchema = new MongooseSchema(
  {
    status: { type: String, enum: Object.values(OrderStatus), required: true },
    changedAt: { type: Date, required: true },
    changedBy: { type: String, required: false },
    comment: { type: String, required: false },
  },
  { _id: false },
);

@Schema({
  collection: 'orders',
  timestamps: true,
})
class OrderModel extends Document<string> implements Order {
  @Prop({ required: true, unique: true, index: true })
  public orderNumber: string;

  @Prop({ required: true, index: true })
  public userId: string;

  @Prop({ type: [ItemSchema], default: [] })
  public items: CartItem[];

  @Prop({ required: true })
  public totalItems: number;

  @Prop({ required: true })
  public totalPrice: number;

  @Prop({
    type: String,
    enum: Object.values(Currency),
    required: true,
    default: Currency.KZT,
  })
  public currency: Currency;

  @Prop({
    type: String,
    enum: Object.values(OrderStatus),
    required: true,
    default: OrderStatus.Pending,
    index: true,
  })
  public status: OrderStatus;

  @Prop({ type: ContactSchema, required: true })
  public contact: OrderContact;

  @Prop({ type: DeliverySchema, required: true })
  public delivery: OrderDelivery;

  @Prop({ type: PaymentSchema, required: true })
  public payment: OrderPayment;

  @Prop({ required: false })
  public comment?: string;

  @Prop({ type: [StatusHistorySchema], default: [] })
  public statusHistory: OrderStatusHistoryItem[];

  @Prop()
  public createdAt: Date;

  @Prop()
  public updatedAt: Date;
}

const OrderSchema = SchemaFactory.createForClass(OrderModel);

OrderSchema.index({ userId: 1, createdAt: -1 });
OrderSchema.index({ status: 1, createdAt: -1 });

export { OrderModel, OrderSchema };
