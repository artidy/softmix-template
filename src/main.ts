import {Container} from "inversify";

import Application from "./app/application";
import Component from "./types/component.types";

const applicationContainer = new Container();

applicationContainer.bind<Application>(Component.Application).to(Application).inSingletonScope();

const application = applicationContainer.get<Application>(Component.Application);

await application.init();
