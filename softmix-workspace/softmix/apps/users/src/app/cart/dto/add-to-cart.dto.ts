import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Min } from 'class-validator';

export class AddToCartDto {
  @ApiProperty({
    description: 'ID товара',
    required: true,
    example: '507f1f77bcf86cd799439011'
  })
  @IsNotEmpty({ message: 'productId не должен быть пустым' })
  @IsString({ message: 'productId должен быть строкой' })
  productId: string;

  @ApiProperty({
    description: 'Название товара',
    required: true,
    example: 'MacBook Pro 16"'
  })
  @IsNotEmpty({ message: 'Название товара не должно быть пустым' })
  @IsString({ message: 'Название должно быть строкой' })
  title: string;

  @ApiProperty({
    description: 'Цена товара',
    required: true,
    example: 2499.99
  })
  @IsNumber({}, { message: 'Цена должна быть числом' })
  @Min(0, { message: 'Цена не может быть отрицательной' })
  price: number;

  @ApiProperty({
    description: 'Количество товара',
    required: true,
    example: 1
  })
  @IsNumber({}, { message: 'Количество должно быть числом' })
  @Min(1, { message: 'Количество должно быть не менее 1' })
  quantity: number;

  @ApiProperty({
    description: 'URL изображения товара',
    required: false,
    example: 'https://example.com/images/product.jpg'
  })
  @IsOptional()
  @IsString({ message: 'URL изображения должен быть строкой' })
  imageUrl?: string;
}
