import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsOptional, IsString, MaxLength } from 'class-validator';
import { OrderStatus } from '@project-lib/shared-types';

export class UpdateOrderStatusDto {
  @ApiProperty({ description: 'Новый статус заказа', enum: OrderStatus })
  @IsEnum(OrderStatus, { message: 'Некорректный статус заказа' })
  public status: OrderStatus;

  @ApiProperty({ description: 'Комментарий к смене статуса', required: false })
  @IsOptional()
  @IsString()
  @MaxLength(500)
  public comment?: string;
}
