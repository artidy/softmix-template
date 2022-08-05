import {Column, DataType, IsEmail, Model, Table} from 'sequelize-typescript';

@Table({
  tableName: 'company_emails',
  timestamps: true
})
class CompanyEmailModel extends Model {
  @IsEmail
  @Column({
    type: DataType.STRING,
    unique: true
  })
  email!: string;

  @Column(DataType.BOOLEAN)
  is_main!: boolean;
}

export default CompanyEmailModel;
