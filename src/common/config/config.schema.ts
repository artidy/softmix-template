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
  SALT_ROUNDS: number;
  UPLOAD_DIR: string;
  JWT_SECRET: string;
  JWT_REFRESH_SECRET: string;
  TOKEN_EXPIRATION_TIME: string;
  JWT_ALGORITHM: string;
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
  },
  SALT_ROUNDS: {
    doc: 'Сложность соли для хеширования пароля',
    format: Number,
    env: 'SALT_ROUNDS',
    default: null
  },
  UPLOAD_DIR: {
    doc: 'Директория для загрузки файлов',
    format: String,
    env: 'UPLOAD_DIR',
    default: './upload',
  },
  JWT_SECRET: {
    doc: 'Секретная строка для генерации токена',
    format: String,
    env: 'JWT_SECRET',
    default: null,
  },
  JWT_REFRESH_SECRET: {
    doc: 'Секретная строка для генерации токена',
    format: String,
    env: 'JWT_REFRESH_SECRET',
    default: null,
  },
  TOKEN_EXPIRATION_TIME: {
    doc: 'Время действия токена',
    format: String,
    env: 'TOKEN_EXPIRATION_TIME',
    default: '1d',
  },
  JWT_ALGORITHM: {
    doc: 'Алгоритм шифрования токена',
    format: String,
    env: 'JWT_ALGORITHM',
    default: 'HS256',
  }
});

export {ConfigSchema, configSchema};
