import {IsEmail, IsJWT} from 'class-validator';

import {getValidateMessage} from '../../../utils/functions.js';
import {ValidateType} from '../../../common/conts.js';

class UpdateTokenDto {
  @IsEmail({},{message: getValidateMessage(ValidateType.IsEmail)})
  public email!: string;

  @IsJWT({message: getValidateMessage(ValidateType.IsJWT)})
  public refreshToken!: string;
}

export default UpdateTokenDto;
