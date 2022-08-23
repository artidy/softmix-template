enum ValidateType {
  MinLength = 'MinLength',
  Maxlength = 'Maxlength',
  IsDateString = 'IsDateString',
  IsEnum = 'IsEnum',
  IsMongoId = 'IsMongoId',
  ArrayMinSize = 'ArrayMinSize',
  ArrayMaxSize = 'ArrayMaxSize',
  IsBoolean = 'IsBoolean',
  Min = 'Min',
  Max = 'Max',
  ValidateNested = 'ValidateNested',
  IsEmail = 'IsEmail',
  IsJWT = 'IsJWT'
}

enum HttpMethod {
  Get = 'get',
  Post = 'post',
  Delete = 'delete',
  Patch = 'patch',
  Put = 'put',
}

enum ApiTokenTypes {
  Token = 'x-token',
  RefreshToken = 'x-refresh-token'
}

const TITLE_MIN_LENGTH = 1;
const TITLE_MAX_LENGTH = 100;

export {
  ValidateType,
  HttpMethod,
  ApiTokenTypes,
  TITLE_MIN_LENGTH,
  TITLE_MAX_LENGTH
};
