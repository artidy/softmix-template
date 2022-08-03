import {IsNumber, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';

import ValidateTypeEnum from '../../../types/validate-type.enum.js';
import {getValidateMessage} from '../../../utils/functions.js';
import {TITLE_MIN_LENGTH, TITLE_MAX_LENGTH} from '../../../common/const.js'

class CreateCategoryDto {
  @MinLength(TITLE_MIN_LENGTH, {
    message: getValidateMessage(ValidateTypeEnum.MinLength, TITLE_MIN_LENGTH)
  })
  @MaxLength(TITLE_MAX_LENGTH, {
    message: getValidateMessage(ValidateTypeEnum.Maxlength, TITLE_MAX_LENGTH)
  })
  title!: string;

  @IsOptional()
  @IsNumber()
  parentId!: string;

  @IsOptional()
  @IsString()
  preview!: string;
}

export default CreateCategoryDto;
