import {ClassConstructor, plainToInstance} from 'class-transformer';
import {jwtVerify, SignJWT} from 'jose';
import {createSecretKey} from 'crypto';

import ValidateTypeEnum from '../types/validate-type.enum.js';
import Payload from '../types/payload';

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

const createErrorObject = (message: string) => ({
  error: message,
});

const createJWT = async (
  algorithm: string,
  jwtSecret: string,
  payload: object,
  expirationTime = '1m'): Promise<string> =>
  new SignJWT({...payload})
    .setProtectedHeader({alg: algorithm})
    .setIssuedAt()
    .setExpirationTime(expirationTime)
    .sign(createSecretKey(jwtSecret, 'utf-8'));

const verifyToken = async (token: string, secret: string, algorithm: string): Promise<Payload> => {
  const {payload} = await jwtVerify(token, createSecretKey(secret, 'utf-8'),
    {algorithms: [algorithm]});

  return {id: payload.id as number, email: payload.email as string};
};

export {
  generateRandomValue,
  getRandomItem,
  getRandomBoolean,
  getRandomItems,
  getMysqlUri,
  getValidateMessage,
  fillDTO,
  createErrorObject,
  createJWT,
  verifyToken
};
