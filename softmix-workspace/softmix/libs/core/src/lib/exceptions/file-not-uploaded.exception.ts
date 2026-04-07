import { NotAcceptableException } from '@nestjs/common';
import { EntityType } from '../lib.const';

export class FileNotUploadedException extends NotAcceptableException {
  constructor(entityType: EntityType, entityId: string) {
    super(`${entityType} с идентификатором — ${entityId} не был загружен`);
  }
}
