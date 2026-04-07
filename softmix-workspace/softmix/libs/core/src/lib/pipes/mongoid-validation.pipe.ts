import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

const BAD_PARAM_ERROR = 'Этот пайп можно использовать только с параметрами!';
const BAD_MONGOID_ERROR = 'Неверный формат идентификатора';

@Injectable()
export class MongoidValidationPipe implements PipeTransform {
  transform(value: string, { type }: ArgumentMetadata): string {
    if (type !== 'param') {
      throw new Error(BAD_PARAM_ERROR)
    }

    if (!Types.ObjectId.isValid(value)) {
      throw new BadRequestException(BAD_MONGOID_ERROR)
    }

    return value;
  }
}
