import { ConfigService } from '@nestjs/config';
import { ClassConstructor, plainToInstance } from 'class-transformer';
import { isObject } from 'class-validator';
import { INestApplication } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';

import { MongoConnection } from './mongo-connection.interface';
import { auth } from './middleware/auth.middleware';

function getMongoConnectionString({username, password, host, port, databaseName, authDatabase}: MongoConnection): string {
  return `mongodb://${username}:${password}@${host}:${port}/${databaseName}?authSource=${authDatabase}`;
}

function fillEntity<D, T>(dto: D, entity: T): void {
  if (!isObject(dto)) return;
  if (!isObject(entity)) return;

  const keys = Object.keys(dto);

  keys.forEach((field) => {
    const key: keyof object = field as keyof object;

    entity[key] = dto[key];
  });
}

function fillObject<T, V>(someDto: ClassConstructor<T>, plainObject: V) {
  return plainToInstance(someDto, plainObject, { excludeExtraneousValues: true });
}

function checkAuth(app: INestApplication) {
  const httpService = app.get<HttpService>(HttpService);
  const configService = app.get<ConfigService>(ConfigService);

  app.use(auth(httpService, configService));
}

function convertTimeToSeconds(time: string): number {
  const numericValue = parseInt(time, 10);

  if (time.endsWith('m')) {
    return numericValue * 60;
  }

  if (time.endsWith('h')) {
    return numericValue * 60 * 60;
  }

  if (time.endsWith('d')) {
    return numericValue * 60 * 60 * 24;
  }

  return numericValue;
}

export {
  getMongoConnectionString,
  fillEntity,
  fillObject,
  checkAuth,
  convertTimeToSeconds,
}
