import { NotFoundException } from '@nestjs/common';

export class ProfileNotFoundException extends NotFoundException {
  constructor(userId: string) {
    super(`Профиль пользователя с идентификатором — ${userId} не найден`);
  }
}
