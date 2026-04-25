import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsEmail,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

export class UpdateMailSettingsDto {
  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public enabled?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public host?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(65535)
  public port?: number;

  @ApiPropertyOptional()
  @IsOptional()
  @IsBoolean()
  public secure?: boolean;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public user?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email отправителя' })
  public fromAddress?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный формат email админа' })
  public adminEmail?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public shopName?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  public shopUrl?: string;
}
