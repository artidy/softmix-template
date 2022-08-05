import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {Sequelize} from 'sequelize-typescript';

import DatabaseInterface from './database.interface.js';
import Component from '../../types/component.types.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import CategoryModel from '../../models/category.model.js';
import CategoryParentModel from '../../models/category-parent.model.js';
import ProductModel from '../../models/product.model.js';
import CompanyEmailModel from '../../models/company-email.model.js';

@injectable()
class DatabaseSequelizeService implements DatabaseInterface {
  private connection?: Sequelize;
  private dbModels: any = {};

  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface) {}

  public async connect(uri: string, database: string): Promise<void> {
    this.logger.info('Попытка подключения к базе данных...');
    await this.init(uri, database);

    this.connection = new Sequelize(`${uri}/${database}`);
    this.connection.addModels([
      CategoryModel,
      CategoryParentModel,
      ProductModel,
      CompanyEmailModel
    ]);
    // Создает все модели в базе данных
    await this.connection.sync({ alter: true });

    await this.connection.authenticate();
    this.logger.info('Подключение к базе данных успешно установлено.');
  }

  public async disconnect(): Promise<void> {
    this.logger.info('Попытка отключения от базы данных...');
    this.connection?.close();
    this.logger.info('База данных отключена.');
  }

  public get models() {
    return this.dbModels;
  }

  async init(uri: string, basename: string): Promise<void> {
    this.connection = new Sequelize(uri);

    await this.connection.query(`CREATE DATABASE IF NOT EXISTS \`${basename}\`;`);
  }
}

export default DatabaseSequelizeService;
