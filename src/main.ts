import {Container} from "inversify";

import Application from "./app/application.js";
import Component from "./types/component.types.js";
import ConfigService from './common/config/config.service.js';
import ConfigInterface from './common/config/config.interface.js';
import DatabaseInterface from './common/database-client/database.interface.js';
import DatabaseSequelizeService from './common/database-client/database-sequelize.service.js';
import LoggerService from './common/logger/logger.service.js';
import {LoggerInterface} from './common/logger/logger.interface.js';

const applicationContainer = new Container();

applicationContainer.bind<LoggerInterface>(Component.LoggerInterface).to(LoggerService).inSingletonScope();
applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<ConfigInterface>(Component.ConfigInterface).to(ConfigService).inSingletonScope();
applicationContainer.bind<DatabaseInterface>(Component.DatabaseInterface).to(DatabaseSequelizeService).inSingletonScope();

const application = applicationContainer.get<Application>(Component.Application);

await application.init();
