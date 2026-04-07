import { Expose } from 'class-transformer';
import { CategoryApi } from '@project-lib/shared-types';

export class CategoryRdo implements CategoryApi {
  @Expose()
  public id: string;

  @Expose()
  public title: string;

  @Expose()
  public ownerId: string;

  @Expose()
  public position: number;

  @Expose()
  public updatedAt: Date;

  @Expose()
  public createdAt: Date;
}
