import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, Length } from 'class-validator';
import { PasswordLength, TitleLength, UserRole } from '@project-lib/shared-types';
import { DtoValidationMessage } from '@project-lib/core';

export class RegisterUserDto {
  @ApiProperty({
    description: 'Имя пользователя.',
    required: true,
    example: 'Иван'
  })
  @Length(
    TitleLength.Min,
    TitleLength.Max,
    {
      message: `${DtoValidationMessage.IncorrectLength} имени`
    })
  name: string;

  @ApiProperty({
    description: 'Уникальное имя для авторизации на сайте.',
    required: true,
    example: 'ivan_user'
  })
  @IsNotEmpty({ message: `Поле логин ${DtoValidationMessage.IsEmpty}` })
  login: string;

  @ApiProperty({
    description: 'Email пользователя (обязательное поле для верификации).',
    required: true,
    example: 'ivan@example.kz'
  })
  @IsNotEmpty({ message: `Поле email ${DtoValidationMessage.IsEmpty}` })
  @IsEmail({}, { message: DtoValidationMessage.IncorrectEmail })
  email: string;

  @ApiProperty({
    description: 'Пароль пользователя.',
    required: true,
    example: '123456789'
  })
  @Length(
    PasswordLength.Min,
    PasswordLength.Max,
    {
      message: `${DtoValidationMessage.IncorrectLength} пароля`
    }
  )
  password: string;

  role: UserRole = UserRole.User;
}
