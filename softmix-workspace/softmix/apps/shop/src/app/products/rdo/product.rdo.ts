import { Expose, Type } from 'class-transformer';
import { CategoryApi, ProductApi, ProductsPaginationApi } from '@project-lib/shared-types';

import { CategoryRdo } from '../../categories/rdo/category.rdo';

export class ProductRdo implements ProductApi {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public price: number;

  @Expose()
  public pricePrev: number;

  @Expose()
  public imageUrl: string;

  @Expose()
  public description: string;

  @Expose()
  public discount: number;

  // Без @Type вложенная категория приходила пустым объектом: её поля отбрасывались как лишние.
  @Expose()
  @Type(() => CategoryRdo)
  public category: CategoryApi;

  @Expose()
  public categoryId: string;

  @Expose()
  public isHot: boolean;

  @Expose()
  public downloadId: number;

  @Expose()
  public downloadCompany: string;

  @Expose()
  public updatedAt: Date;

  @Expose()
  public createdAt: Date;
}
