import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsInt, IsISO8601, IsOptional, IsString, Min } from 'class-validator';
import { OrderStatus } from '@project-lib/shared-types';

export class OrdersQueryDto {
  @ApiPropertyOptional({ description: 'Номер страницы', example: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public page?: number;

  @ApiPropertyOptional({ description: 'Количество на странице', example: 20 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  public limit?: number;

  @ApiPropertyOptional({ description: 'Статус заказа', enum: OrderStatus })
  @IsOptional()
  @IsEnum(OrderStatus)
  public status?: OrderStatus;

  @ApiPropertyOptional({ description: 'ID пользователя (только для админа)' })
  @IsOptional()
  @IsString()
  public userId?: string;

  @ApiPropertyOptional({ description: 'Поиск по номеру/контактам' })
  @IsOptional()
  @IsString()
  public search?: string;

  @ApiPropertyOptional({ description: 'Дата от (ISO 8601)' })
  @IsOptional()
  @IsISO8601()
  public dateFrom?: string;

  @ApiPropertyOptional({ description: 'Дата до (ISO 8601)' })
  @IsOptional()
  @IsISO8601()
  public dateTo?: string;
}
