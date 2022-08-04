import {Column, Model, Table, DataType, Length, ForeignKey, BelongsTo} from 'sequelize-typescript';

import {TITLE_MAX_LENGTH, TITLE_MIN_LENGTH} from '../common/const.js';
import CategoryModel from './category.model.js';

@Table({
  tableName: 'products',
  timestamps: true
})
class ProductModel extends Model {
  @Length({min: TITLE_MIN_LENGTH, max: TITLE_MAX_LENGTH})
  @Column(DataType.STRING(TITLE_MAX_LENGTH))
  title!: string;

  @ForeignKey(() => CategoryModel)
  @Column
  categoryId!: number;

  @BelongsTo(() => CategoryModel, 'categoryId')
  category!: CategoryModel;

  @Column(DataType.TEXT)
  preview?: string;

  @Column(DataType.TEXT)
  description!: string;
}

export default ProductModel;
