import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsOptional } from 'class-validator';
import { DtoValidationMessage } from '@project-lib/core';
import { ProductCreate } from '@project-lib/shared-types';

export class CreateProductDto implements ProductCreate {
  @ApiProperty({
    description: 'Наименование',
    required: true,
    example: 'Новый товар'
  })
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле наименование`
  })
  title: string;

  @ApiProperty({
    description: 'Цена',
    required: true,
    example: 100
  })
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле цена`
  })
  price: number;

  @ApiProperty({
    description: 'Цена без скидки',
    required: true,
    example: 300
  })
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле цена без скидки`
  })
  pricePrev: number;

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
    required: true,
    example: 'Новый товар для продажи'
  })
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле описание`
  })
  description: string;

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
    required: true,
    example: 'Группа товаров'
  })
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле категория`
  })
  categoryId: string;

  @ApiProperty({
    description: 'Популярный товар',
    required: true,
    example: true
  })
  @IsNotEmpty({
    message: `${DtoValidationMessage.IsEmpty} поле популярный товар`
  })
  isHot: boolean;

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
