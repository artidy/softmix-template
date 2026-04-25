import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, MaxLength, ValidateNested } from 'class-validator';

import { OrderContactDto } from './order-contact.dto';
import { OrderDeliveryDto } from './order-delivery.dto';
import { OrderPaymentDto } from './order-payment.dto';

export class CheckoutDto {
  @ApiProperty({ description: 'Контактные данные', type: OrderContactDto })
  @IsObject()
  @ValidateNested()
  @Type(() => OrderContactDto)
  public contact: OrderContactDto;

  @ApiProperty({ description: 'Параметры доставки', type: OrderDeliveryDto })
  @IsObject()
  @ValidateNested()
  @Type(() => OrderDeliveryDto)
  public delivery: OrderDeliveryDto;

  @ApiProperty({ description: 'Параметры оплаты', type: OrderPaymentDto })
  @IsObject()
  @ValidateNested()
  @Type(() => OrderPaymentDto)
  public payment: OrderPaymentDto;

  @ApiProperty({ description: 'Комментарий к заказу', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(1000, { message: 'Комментарий слишком длинный' })
  public comment?: string;
}
