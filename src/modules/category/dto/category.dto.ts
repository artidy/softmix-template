import {Expose, Type} from 'class-transformer';

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
}

export default CategoryDto;
