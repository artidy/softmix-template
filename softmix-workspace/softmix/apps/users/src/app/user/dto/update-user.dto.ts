import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsEnum, IsOptional, IsString, Length } from 'class-validator';
import { PasswordLength, TitleLength, UserRole } from '@project-lib/shared-types';
import { DtoValidationMessage } from '@project-lib/core';

export class UpdateUserDto {
  @ApiProperty({
    description: 'Имя пользователя.',
    required: false,
    example: 'Иван'
  })
  @IsOptional()
  @Length(
    TitleLength.Min,
    TitleLength.Max,
    {
      message: `${DtoValidationMessage.IncorrectLength} имени`
    })
  name?: string;

  @ApiProperty({
    description: 'Пароль пользователя.',
    required: false,
    example: '123456789'
  })
  @IsOptional()
  @Length(
    PasswordLength.Min,
    PasswordLength.Max,
    {
      message: `${DtoValidationMessage.IncorrectLength} пароля`
    }
  )
  password?: string;

  @ApiProperty({
    description: 'Роль пользователя.',
    required: false,
    example: UserRole.User
  })
  @IsOptional()
  @IsEnum(UserRole, {
    message: `${DtoValidationMessage.ArrayIsNotContains} для роли`
  })
  role?: UserRole;

  @ApiProperty({
    description: 'Email пользователя.',
    required: false,
    example: 'user@example.com'
  })
  @IsOptional()
  @IsEmail({}, { message: 'Некорректный email адрес' })
  email?: string;

  @ApiProperty({
    description: 'Телефон пользователя.',
    required: false,
    example: '+7 (999) 123-45-67'
  })
  @IsOptional()
  @IsString({ message: 'Телефон должен быть строкой' })
  phone?: string;

  @ApiProperty({
    description: 'Адрес пользователя.',
    required: false,
    example: 'г. Москва, ул. Ленина, д. 1, кв. 10'
  })
  @IsOptional()
  @IsString({ message: 'Адрес должен быть строкой' })
  address?: string;
}
