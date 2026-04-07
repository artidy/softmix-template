import { NotAcceptableException } from '@nestjs/common';

export class UserPasswordWrongException extends NotAcceptableException {
  constructor() {
    super('Неверный пароль пользователя');
  }
}
