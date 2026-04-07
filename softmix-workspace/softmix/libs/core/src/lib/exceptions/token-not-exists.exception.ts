import { NotFoundException } from '@nestjs/common';

export class TokenNotExistsException extends NotFoundException {
  constructor(tokenId: string) {
    super(`Токен с идентификатором ${tokenId} не существует`);
  }
}
