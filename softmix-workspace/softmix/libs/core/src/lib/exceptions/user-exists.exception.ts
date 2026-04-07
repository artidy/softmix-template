import { NotAcceptableException } from '@nestjs/common';

export class UserExistsException extends NotAcceptableException {
  constructor(email: string) {
    super(`Пользователь с ${email} уже существует`);
  }
}
