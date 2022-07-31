import "reflect-metadata";
import {inject, injectable} from "inversify";
import express, {Express} from "express";

import Component from "../types/component.types.js";
import {LoggerInterface} from "../common/logger/logger.interface.js";
import ConfigInterface from '../common/config/config.interface.js';
import {getMysqlUri} from '../utils/functions.js';
import DatabaseInterface from '../common/database-client/database.interface.js';

@injectable()
class Application {
  private expressApp: Express;

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
    @inject(Component.ConfigInterface) private config: ConfigInterface,
    @inject(Component.DatabaseInterface) private database: DatabaseInterface
  ) {
    this.expressApp = express();
  }

  public registerRoutes() {}

  public registerMiddlewares() {}

  public registerExceptionFilters() {}

  public async init() {
    this.logger.info('Инициализация приложения...');

    const host = this.config.get('HOST');
    const port = this.config.get('PORT');
    const db_host = this.config.get('DB_HOST');
    const db_port = this.config.get('DB_PORT');
    const db_user = this.config.get('DB_USER');
    const db_pass = this.config.get('DB_PASSWORD');
    const db_name = this.config.get('DB_NAME');
    const dbUri = getMysqlUri(db_user, db_pass, db_host, db_port, db_name);

    await this.database.connect(dbUri);

    this.registerMiddlewares();
    this.registerRoutes();
    this.registerExceptionFilters();
    this.expressApp.listen(port);
    this.logger.info(`Сервер стартовал на ${host}:${port}`);
    this.logger.info('Приложение инициализировано.');
  }
}

export default Application;
