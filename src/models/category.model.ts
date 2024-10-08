import {Column, Model, Table, DataType, Length, ForeignKey, BelongsTo} from 'sequelize-typescript';

import {TITLE_MAX_LENGTH, TITLE_MIN_LENGTH} from '../common/const.js';
import CategoryParentModel from './category-parent.model.js';

@Table({
  tableName: 'categories',
  timestamps: true,
  comment: 'Table for products categories'
})
class CategoryModel extends Model {
  @Length({min: TITLE_MIN_LENGTH, max: TITLE_MAX_LENGTH})
  @Column(DataType.STRING(TITLE_MAX_LENGTH))
  title!: string;

  @ForeignKey(() => CategoryParentModel)
  @Column
  parentId?: number;

  @BelongsTo(() => CategoryParentModel, 'parentId')
  parent!: CategoryParentModel;

  @Column(DataType.TEXT)
  preview!: string;
}

export default CategoryModel;
