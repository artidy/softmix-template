import {Container} from "inversify";

import Application from "./app/application.js";
import Component from "./types/component.types.js";
import ConfigService from './common/config/config.service.js';
import ConfigInterface from './common/config/config.interface.js';
import DatabaseInterface from './common/database-client/database.interface.js';
import DatabaseSequelizeService from './common/database-client/database-sequelize.service.js';
import LoggerService from './common/logger/logger.service.js';
import {LoggerInterface} from './common/logger/logger.interface.js';
import CategoryServiceInterface from './modules/category/category-service.interface.js';
import CategoryService from './modules/category/category.service.js';
import CategoryController from './modules/category/category.controller.js';
import {ControllerInterface} from './common/controller/controller.interface.js';
import ProductServiceInterface from './modules/product/product-service.interface.js';
import ProductService from './modules/product/product.service.js';
import ProductController from './modules/product/product.controller.js';
import {ExceptionFilterInterface} from './common/errors/exception-filter.interface.js';
import ExceptionFilter from './common/errors/exception-filter.js';

const applicationContainer = new Container();

applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
applicationContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseSequelizeService).inSingletonScope();
applicationContainer.bind<CategoryServiceInterface>(Component.CategoryServiceInterface).to(CategoryService).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.CategoryController).to(CategoryController).inSingletonScope();
applicationContainer.bind<ProductServiceInterface>(Component.ProductServiceInterface).to(ProductService).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.ProductController).to(ProductController).inSingletonScope();
applicationContainer.bind<ExceptionFilterInterface>(Component.ExceptionFilterInterface).to(ExceptionFilter).inSingletonScope();

const application = applicationContainer.get<Application>(Component.Application);

await application.init();
