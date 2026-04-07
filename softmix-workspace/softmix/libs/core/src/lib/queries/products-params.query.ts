import { Transform } from 'class-transformer';
import { IsNumber, IsOptional } from 'class-validator';

import { DEFAULT_LIMIT, DtoValidationMessage, ProductsQuery } from '@project-lib/shared-types';

export class ProductsParamsQuery implements ProductsQuery {
  @Transform(({ value }) => +value || DEFAULT_LIMIT)
  @IsNumber({}, {
    message: DtoValidationMessage.IsNotInteger
  })
  @IsOptional()
  public limit = DEFAULT_LIMIT;

  @Transform(({ value }) => +value)
  @IsNumber({}, {
    message: DtoValidationMessage.IsNotInteger
  })
  @IsOptional()
  public offset: number;
}
