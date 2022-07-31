import "reflect-metadata";
import {inject, injectable} from "inversify";
import express, {Express} from "express";
import Component from "../types/component.types";
import {LoggerInterface} from "../common/logger/logger.interface";

@injectable()
class Application {
  private expressApp: Express;

  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface
  ) {
    this.expressApp = express();
  }

  public registerRoutes() {}

  public registerMiddlewares() {}

  public registerExceptionFilters() {}

  public async init() {
    this.logger.info('Инициализация приложения...');

    this.expressApp.listen();
  }
}

export default Application;
