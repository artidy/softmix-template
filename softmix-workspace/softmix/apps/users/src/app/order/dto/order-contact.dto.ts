import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsString, Matches, MaxLength, MinLength } from 'class-validator';

export class OrderContactDto {
  @ApiProperty({ description: 'Имя получателя', example: 'Иван' })
  @IsString({ message: 'Имя должно быть строкой' })
  @IsNotEmpty({ message: 'Имя не должно быть пустым' })
  @MinLength(2, { message: 'Имя слишком короткое' })
  @MaxLength(100, { message: 'Имя слишком длинное' })
  public name: string;

  @ApiProperty({ description: 'Телефон в формате +7XXXXXXXXXX', example: '+77011234567' })
  @IsString({ message: 'Телефон должен быть строкой' })
  @Matches(/^\+7\d{10}$/, { message: 'Телефон должен быть в формате +7XXXXXXXXXX (Казахстан)' })
  public phone: string;

  @ApiProperty({ description: 'Email получателя', example: 'user@example.kz' })
  @IsEmail({}, { message: 'Некорректный формат email' })
  public email: string;
}
