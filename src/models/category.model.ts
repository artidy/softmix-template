import {Column, Model, Table, DataType} from 'sequelize-typescript';

@Table({
  tableName: 'categories',
  timestamps: true,
  comment: 'Table for products categories'
})
class CategoryModel extends Model {
  @Column(DataType.STRING(100))
  title!: string;

  @Column(DataType.INTEGER)
  parentId!: string;

  @Column(DataType.TEXT)
  preview!: string;
}

export default CategoryModel;
