import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {Sequelize} from 'sequelize';

import DatabaseInterface from './database.interface.js';
import Component from '../../types/component.types.js';
import {LoggerInterface} from '../logger/logger.interface.js';

@injectable()
class DatabaseSequelizeService implements DatabaseInterface {
  private connection?: Sequelize;

  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface) {}

  public async connect(uri: string): Promise<void> {
    this.logger.info('Попытка подключения к базе данных...');
    this.connection = new Sequelize(uri);

    try {
      await this.connection.authenticate({

      });
      this.logger.info('Подключение к базе данных успешно установлено.');
    } catch (error) {
      this.logger.error(`Ошибка подключения к базе данных: ${error}`);
    }
  }

  public async disconnect(): Promise<void> {
    this.logger.info('Попытка отключения от базы данных...');
    this.connection?.close();
    this.logger.info('База данных отключена.');
  }
}

export default DatabaseSequelizeService;
