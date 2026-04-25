import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsEnum,
  IsNotEmpty,
  IsNumber,
  IsObject,
  IsOptional,
  IsString,
  Min,
  ValidateNested,
} from 'class-validator';
import { DeliveryType } from '@project-lib/shared-types';

export class OrderDeliveryAddressDto {
  @ApiProperty({ description: 'Область / регион', required: false, example: 'Алматинская область' })
  @IsOptional()
  @IsString()
  public region?: string;

  @ApiProperty({ description: 'Город', example: 'Алматы' })
  @IsString({ message: 'Город должен быть строкой' })
  @IsNotEmpty({ message: 'Город не должен быть пустым' })
  public city: string;

  @ApiProperty({ description: 'Улица', required: false, example: 'ул. Абая' })
  @IsOptional()
  @IsString()
  public street?: string;

  @ApiProperty({ description: 'Дом', required: false, example: '10' })
  @IsOptional()
  @IsString()
  public house?: string;

  @ApiProperty({ description: 'Квартира / офис', required: false, example: '25' })
  @IsOptional()
  @IsString()
  public apartment?: string;

  @ApiProperty({ description: 'Почтовый индекс', required: false, example: '050000' })
  @IsOptional()
  @IsString()
  public postalCode?: string;
}

export class OrderDeliveryDto {
  @ApiProperty({ description: 'Способ доставки', enum: DeliveryType, example: DeliveryType.Courier })
  @IsEnum(DeliveryType, { message: 'Некорректный способ доставки' })
  public type: DeliveryType;

  @ApiProperty({ description: 'Адрес доставки', required: false, type: OrderDeliveryAddressDto })
  @IsOptional()
  @IsObject()
  @ValidateNested()
  @Type(() => OrderDeliveryAddressDto)
  public address?: OrderDeliveryAddressDto;

  @ApiProperty({ description: 'ID пункта самовывоза', required: false })
  @IsOptional()
  @IsString()
  public pickupPointId?: string;

  @ApiProperty({ description: 'Стоимость доставки в тенге', required: false, example: 1500 })
  @IsOptional()
  @IsNumber({}, { message: 'Стоимость доставки должна быть числом' })
  @Min(0, { message: 'Стоимость доставки не может быть отрицательной' })
  public cost?: number;
}
