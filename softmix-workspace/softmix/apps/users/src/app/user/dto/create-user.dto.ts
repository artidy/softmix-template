import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, Length } from 'class-validator';
import { PasswordLength, TitleLength, UserRole } from '@project-lib/shared-types';
import { DtoValidationMessage } from '@project-lib/core';

export class CreateUserDto {
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
    example: 'admin'
  })
  @IsNotEmpty({message: `Поле логин ${DtoValidationMessage.IsEmpty}`})
  login: string;

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

  @ApiProperty({
    description: 'Роль пользователя.',
    required: true,
    example: UserRole.User
  })
  @IsEnum(UserRole, {
    message: `${DtoValidationMessage.ArrayIsNotContains} для роли`
  })
  role: UserRole;
}
