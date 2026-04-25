import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsOptional, IsString } from 'class-validator';

export class UpdatePaymentSettingsDto {
  @ApiPropertyOptional({ description: 'Включён ли способ оплаты' })
  @IsOptional()
  @IsBoolean()
  public enabled?: boolean;

  @ApiPropertyOptional({ description: 'Тестовый режим' })
  @IsOptional()
  @IsBoolean()
  public testMode?: boolean;

  @ApiPropertyOptional({ description: 'Идентификатор мерчанта' })
  @IsOptional()
  @IsString()
  public merchantId?: string;

  @ApiPropertyOptional({ description: 'Секретный ключ' })
  @IsOptional()
  @IsString()
  public secret?: string;

  @ApiPropertyOptional({ description: 'URL API провайдера' })
  @IsOptional()
  @IsString()
  public apiUrl?: string;

  @ApiPropertyOptional({ description: 'Дополнительные параметры (JSON-строка)' })
  @IsOptional()
  @IsString()
  public extra?: string;
}
