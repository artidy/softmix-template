import { NotFoundException } from '@nestjs/common';

export class UserNotRegisteredException extends NotFoundException {
  constructor(login: string) {
    super(`Пользователь с ${login} не зарегистрирован`);
  }
}
