import {Expose, Type} from 'class-transformer';

import ProductDto from '../../product/dto/product.dto.js';

class CategoryDto {
  @Expose()
  public id!: number;

  @Expose()
  public title!: string;

  @Expose()
  @Type(() => CategoryDto)
  public parent!: CategoryDto;

  @Expose()
  preview!: string;

  @Expose()
  @Type(() => ProductDto)
  products?: ProductDto[];
}

export default CategoryDto;
