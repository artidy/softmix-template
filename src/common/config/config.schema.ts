import convict from 'convict';
import validators from 'convict-format-with-validator';

convict.addFormats(validators);

type ConfigSchema = {
  HOST: string;
  PORT: number;
  DB_HOST: string;
  DB_PORT: number;
  DB_USER: string;
  DB_PASSWORD: string;
  DB_NAME: string;
}

const configSchema = convict<ConfigSchema>({
  HOST: {
    doc: 'Адрес сайта',
    format: String,
    env: 'HOST',
    default: 'http://localhost'
  },
  PORT: {
    doc: 'Порт сайта',
    format: 'port',
    env: 'PORT',
    default: 4000
  },
  DB_HOST: {
    doc: 'Адрес базы данных',
    format: String,
    env: 'DB_HOST',
    default: 'localhost'
  },
  DB_PORT: {
    doc: 'Порт базы данных',
    format: 'port',
    env: 'DB_PORT',
    default: 3306
  },
  DB_USER: {
    doc: 'Пользователь базы данных',
    format: String,
    env: 'DB_USER',
    default: 'root'
  },
  DB_PASSWORD: {
    doc: 'Пароль базы данных',
    format: String,
    env: 'DB_PASSWORD',
    default: null
  },
  DB_NAME: {
    doc: 'Имя базы данных сайта',
    format: String,
    env: 'DB_NAME',
    default: null
  }
});

export {ConfigSchema, configSchema};
