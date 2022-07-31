import {Container} from "inversify";

import Application from "./app/application";
import Component from "./types/component.types";
import ConfigService from './common/config/config.service.js';

const applicationContainer = new Container();

applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();
applicationContainer.bind<ConfigService>(Component.ConfigService).to(ConfigService).inSingletonScope();

const application = applicationContainer.get<Application>(Component.Application);

await application.init();
