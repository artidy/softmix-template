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

  public async connect(uri: string, database: string): Promise<void> {
    this.logger.info('Попытка подключения к базе данных...');
    await this.init(uri, database);

    this.connection = new Sequelize(`${uri}/${database}`);

    await this.connection.authenticate();
    this.logger.info('Подключение к базе данных успешно установлено.');
  }

  public async disconnect(): Promise<void> {
    this.logger.info('Попытка отключения от базы данных...');
    this.connection?.close();
    this.logger.info('База данных отключена.');
  }

  async init(uri: string, database: string): Promise<void> {
    const connection = new Sequelize(uri);

    await connection.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await connection.close();
  }
}

export default DatabaseSequelizeService;
