import { ApiProperty } from '@nestjs/swagger';
import { IsEnum } from 'class-validator';
import { PaymentMethod } from '@project-lib/shared-types';

export class OrderPaymentDto {
  @ApiProperty({ description: 'Способ оплаты', enum: PaymentMethod, example: PaymentMethod.CashOnDelivery })
  @IsEnum(PaymentMethod, { message: 'Некорректный способ оплаты' })
  public method: PaymentMethod;
}
