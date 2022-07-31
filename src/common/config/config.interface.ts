import {ConfigSchema} from './config.schema.js';

interface ConfigInterface {
  get<T extends keyof ConfigSchema>(key: T): ConfigSchema[T];
}

export default ConfigInterface;
