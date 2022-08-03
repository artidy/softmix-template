import {ClassConstructor, plainToInstance} from 'class-transformer';

import ValidateTypeEnum from '../types/validate-type.enum.js';

const generateRandomValue = (min: number, max: number, digit = 0): number =>
  +((Math.random() * (max - min)) + min).toFixed(digit);

const getRandomItem = <T>(items: T[]): T =>
  items[generateRandomValue(0, items.length - 1)];

const getRandomBoolean = (): boolean => Boolean(generateRandomValue(0, 1));

const getRandomItems = <T>(items: T[]): T[] => {
  const itemsCount = generateRandomValue(1, items.length);
  const result = [] as T[];

  while (result.length < itemsCount) {
    const randomItem = getRandomItem(items);

    if (!result.includes(randomItem)) {
      result.push(randomItem);
    }
  }

  return result;
};

const getMysqlUri = (user: string, password: string, host: string, port: number): string => {
  return `mysql://${user}:${password}@${host}:${port}`;
};

const getValidateMessage = (validateType: ValidateTypeEnum, value: string | number = ''): string => {
  switch(validateType) {
    case ValidateTypeEnum.MinLength:
      return `должно содержать значение длиной не меньше ${value} символов.`;
    case ValidateTypeEnum.Maxlength:
      return `должно содержать значение длиной больше ${value} символов.`;
    default:
      return `${validateType} - неизвестная ошибка.`;
  }
};

const fillDTO = <T, V>(someDto: ClassConstructor<T>, plainObject: V) =>
  plainToInstance(someDto, plainObject, {excludeExtraneousValues: true});

export {
  generateRandomValue,
  getRandomItem,
  getRandomBoolean,
  getRandomItems,
  getMysqlUri,
  getValidateMessage,
  fillDTO
};
