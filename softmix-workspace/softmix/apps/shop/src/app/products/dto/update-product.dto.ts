import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { DtoValidationMessage } from '@project-lib/core';
import { ProductUpdate } from '@project-lib/shared-types';

export class UpdateProductDto implements ProductUpdate {
  @ApiProperty({
    description: 'Наименование',
    required: false,
    example: 'Новый товар'
  })
  @IsOptional()
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле наименование`
  })
  title?: string;

  @ApiProperty({
    description: 'Цена',
    required: false,
    example: 100
  })
  @IsOptional()
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле цена`
  })
  price?: number;

  @ApiProperty({
    description: 'Цена без скидки',
    required: false,
    example: 300
  })
  @IsOptional()
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле цена без скидки`
  })
  pricePrev?: number;

  @ApiProperty({
    description: 'Путь к изображению',
    required: false,
    example: '1.png'
  })
  @IsOptional()
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле изображение`
  })
  imageUrl?: string;

  @ApiProperty({
    description: 'Описание',
    required: false,
    example: 'Новый товар для продажи'
  })
  @IsOptional()
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле описание`
  })
  description?: string;

  @ApiProperty({
    description: 'Скидка',
    required: false,
    example: 10
  })
  @IsOptional()
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле скидка`
  })
  discount?: number;

  @ApiProperty({
    description: 'Идентификатор категории',
    required: false,
    example: 'Группа товаров'
  })
  @IsOptional()
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле категория`
  })
  categoryId?: string;

  @ApiProperty({
    description: 'Популярный товар',
    required: false,
    example: true
  })
  @IsOptional()
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле популярный товар`
  })
  isHot?: boolean;

  @ApiProperty({
    description: 'Идентификатор загруженного товара',
    required: false,
    example: 123
  })
  @IsOptional()
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле идентификатор загруженного товара`
  })
  downloadId?: number;

  @ApiProperty({
    description: 'Компания у которой был загружен товар',
    required: false,
    example: 300
  })
  @IsOptional()
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле компании загрузки товара`
  })
  downloadCompany?: string;
}
