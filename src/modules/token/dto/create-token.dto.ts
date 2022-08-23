import {IsJWT, IsNumber} from 'class-validator';

import {getValidateMessage} from '../../../utils/functions.js';
import {ValidateType} from '../../../common/conts.js';

class CreateTokenDto {
  @IsNumber()
  userId!: number;

  @IsJWT({message: getValidateMessage(ValidateType.IsJWT)})
  token!: string;

  @IsJWT({message: getValidateMessage(ValidateType.IsJWT)})
  refreshToken!: string;
}

export default CreateTokenDto;
