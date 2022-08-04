import {HasMany, Model, Table} from 'sequelize-typescript';

import CategoryModel from './category.model.js';

@Table({
  tableName: 'categories_parent',
  comment: 'Table for category parents'
})
class CategoryParentModel extends Model {
  @HasMany(() => CategoryModel, 'parentId')
  children!: CategoryModel[];
}

export default CategoryParentModel;
