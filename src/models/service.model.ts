import {Column, DataType, Model, Table} from 'sequelize-typescript';

@Table({
  tableName: 'services',
  timestamps: true
})
class ServiceModel extends Model {
  @Column(DataType.STRING)
  title!: string;

  @Column(DataType.TEXT)
  preview?: string;

  @Column(DataType.TEXT)
  description!: string;
}

export default ServiceModel;
