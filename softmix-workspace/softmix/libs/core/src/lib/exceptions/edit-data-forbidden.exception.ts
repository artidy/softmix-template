import { NotAcceptableException } from '@nestjs/common';

export class EditDataForbiddenException extends NotAcceptableException {
  constructor() {
    super(`Удаление или изменение данных запрещено`);
  }
}
