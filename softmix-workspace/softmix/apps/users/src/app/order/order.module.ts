import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';

import { CartModule } from '../cart/cart.module';
import { UserModule } from '../user/user.module';
import { NotificationModule } from '../notifications/notification.module';
import { OrderController } from './order.controller';
import { OrderModel, OrderSchema } from './order.model';
import { OrderRepository } from './order.repository';
import { OrderService } from './order.service';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: OrderModel.name, schema: OrderSchema }]),
    CartModule,
    UserModule,
    NotificationModule,
  ],
  controllers: [OrderController],
  providers: [OrderService, OrderRepository],
  exports: [OrderService, OrderRepository],
})
export class OrderModule {}
