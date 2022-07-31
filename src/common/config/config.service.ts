import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {config} from 'dotenv';

import {configSchema, ConfigSchema} from './config.schema.js';
import {LoggerInterface} from '../logger/logger.interface.js';
import Component from '../../types/component.types.js';

@injectable()
class ConfigService {
  private readonly config: ConfigSchema;

  constructor(@inject(Component.LoggerInterface) private logger: LoggerInterface) {

    const parsedOutput = config();

    if (parsedOutput.error) {
      throw new Error('Невозможно считать файл .env. Возможно файла не существует.');
    }

    configSchema.load({});
    configSchema.validate({allowed: 'strict', output: this.logger.error});

    this.config = configSchema.getProperties();
    this.logger.info('Файл .env успешно считан.');
  }

  public get<T extends keyof ConfigSchema>(key: T) {
    return this.config[key];
  }
}

export default ConfigService;
