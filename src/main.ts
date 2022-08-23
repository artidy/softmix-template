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
import CompanyEmailServiceInterface from './modules/company-email/company-email-service.interface.js';
import CompanyEmailService from './modules/company-email/company-email.service.js';
import CompanyEmailController from './modules/company-email/company-email.controller.js';
import CompanyPhoneServiceInterface from './modules/company-phone/company-phone-service.interface.js';
import CompanyPhoneService from './modules/company-phone/company-phone.service.js';
import CompanyPhoneController from './modules/company-phone/company-phone.controller.js';
import ServiceServiceInterface from './modules/service/service-service.interface.js';
import ServiceService from './modules/service/service.service.js';
import ServiceController from './modules/service/service.controller.js';
import UserServiceInterface from './modules/user/user-service.interface.js';
import UserService from './modules/user/user.service.js';
import UserController from './modules/user/user.controller.js';
import {TokenServiceInterface} from './modules/token/token-service.interface.js';
import TokenService from './modules/token/token.service.js';

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
applicationContainer.bind<CompanyEmailServiceInterface>(Component.CompanyEmailServiceInterface).to(CompanyEmailService).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.CompanyEmailController).to(CompanyEmailController).inSingletonScope();
applicationContainer.bind<CompanyPhoneServiceInterface>(Component.CompanyPhoneServiceInterface).to(CompanyPhoneService).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.CompanyPhoneController).to(CompanyPhoneController).inSingletonScope();
applicationContainer.bind<ServiceServiceInterface>(Component.ServiceService).to(ServiceService).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.ServiceController).to(ServiceController).inSingletonScope();
applicationContainer.bind<UserServiceInterface>(Component.UserServiceInterface).to(UserService).inSingletonScope();
applicationContainer.bind<ControllerInterface>(Component.UserController).to(UserController).inSingletonScope();
applicationContainer.bind<TokenServiceInterface>(Component.TokenServiceInterface).to(TokenService).inSingletonScope();

const application = applicationContainer.get<Application>(Component.Application);

await application.init();
