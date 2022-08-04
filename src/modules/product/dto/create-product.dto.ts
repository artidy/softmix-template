import {IsNumber, IsOptional, IsString, MaxLength, MinLength} from 'class-validator';

import {TITLE_MAX_LENGTH, TITLE_MIN_LENGTH} from '../../../common/const.js';
import {getValidateMessage} from '../../../utils/functions.js';
import ValidateTypeEnum from '../../../types/validate-type.enum.js';

class CreateProductDto {
  @MinLength(TITLE_MIN_LENGTH, {
    message: getValidateMessage(ValidateTypeEnum.MinLength, TITLE_MIN_LENGTH)
  })
  @MaxLength(TITLE_MAX_LENGTH, {
    message: getValidateMessage(ValidateTypeEnum.Maxlength, TITLE_MAX_LENGTH)
  })
  public title!: string;

  @IsNumber()
  public categoryId!: number;

  @IsOptional()
  @IsString()
  preview?: string;

  @IsString()
  description!: string;
}

export default CreateProductDto;
