import {Expose, Type} from 'class-transformer';

import CategoryDto from '../../category/dto/category.dto.js';

class ProductDto {
  @Expose()
  public id!: number;

  @Expose()
  public title!: string;

  @Expose()
  @Type(() => CategoryDto)
  public category!: CategoryDto;

  @Expose()
  preview?: string;

  @Expose()
  description!: string;
}

export default ProductDto;
