import {Column, Model, Table} from 'sequelize-typescript';

@Table({
  tableName: 'company_phones',
  timestamps: true
})
class CompanyPhoneModel extends Model {
  @Column
  phone_number!: string;

  @Column
  is_main!: boolean;
}

export default CompanyPhoneModel;
