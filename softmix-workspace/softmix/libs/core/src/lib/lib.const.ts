enum EnvValidationMessage {
  DBHostNotRequired = 'MongoDB host is not required',
  DBNameNotRequired = 'Database name is not required',
  DBPortNotRequired = 'MongoDB port is not required',
  DBUserNotRequired = 'MongoDB user is not required',
  DBPasswordNotRequired = 'MongoDB password is not required',
  DBBaseAuthNotRequired = 'MongoDB authentication base is not required',
  JWTSecretNotRequired = 'JWT secret is not required',
  JWTSecretExpTimeNotRequired = 'JWT secret exp time is not required',
  JWTRefreshSecretNotRequired = 'JWT refresh secret is not required',
  JWTRefreshSecretExpTimeNotRequired = 'JWT refresh secret exp time is not required',
  PgAdminEmailNotRequired = 'PG admin email is not required',
  PgAdminServerModeNotRequired = 'PG admin server mode is not required',
  URLServiceNotRequired = 'URL service is not required',
  ServerInvalid = 'Host smtp server is invalid',
  ServerPortInvalid = 'Server port is invalid',
  EmailIncorrect = 'Email incorrect',
  UserIncorrect = 'User incorrect',
  PasswordIncorrect = 'Password incorrect',
  DBHostRequired = 'MongoDB host is required',
  DBNameRequired = 'Database name is required',
  DBPortRequired = 'MongoDB port is required',
  DBUserRequired = 'MongoDB user is required',
  DBPasswordRequired = 'MongoDB password is required',
  DBBaseAuthRequired = 'MongoDB authentication base is required',
  RabbitUserRequired = 'Rabbit user incorrect',
  RabbitPasswordRequired = 'Rabbit password incorrect',
  RabbitHostRequired = 'Rabbit host incorrect',
  RabbitQueueRequired = 'Rabbit queue incorrect',
}

enum MongoOptionFields {
  Name = 'name',
  Host = 'host',
  Port = 'port',
  User = 'user',
  Password = 'password',
  AuthBase = 'authBase'
}

enum DtoValidationMessage {
  IncorrectLength = 'Некорректная длина',
  ArrayIsNotContains = 'Недопустимое значение',
  TooLowNumber = 'Значение должно быть больше',
  TooHighNumber = 'Значение должно быть меньше',
  IsNotInteger = 'Значение должно быть целым числом в поле',
  IsEmpty = 'должно быть заполнено',
  IncorrectEmail = 'Неверный формат электронной почты',
  IsNotDate = 'Неверный формат даты',
  IsNotMongoId = 'Неверный формат идентификатора'
}

enum EntityType {
  File = 'файл'
}

const MONGO_CONFIG_TOKEN = 'mongodb';
const DEFAULT_PORT = 3333;
const DEFAULT_MONGO_PORT = '27017';
const GLOBAL_PREFIX = 'api';

export {
  EnvValidationMessage,
  MongoOptionFields,
  DtoValidationMessage,
  EntityType,
  MONGO_CONFIG_TOKEN,
  DEFAULT_PORT,
  DEFAULT_MONGO_PORT,
  GLOBAL_PREFIX,
}
