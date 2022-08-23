import {BelongsTo, Column, DataType, ForeignKey, Model, Table} from 'sequelize-typescript';

import UserModel from '../user/user.model.js';

@Table({
  tableName: 'tokens',
  timestamps: true
})
class TokenModel extends Model {
  @ForeignKey(() => UserModel)
  @Column
  userId!: number;

  @BelongsTo(() => UserModel)
  user!: UserModel;

  @Column(DataType.STRING)
  token!: string;

  @Column(DataType.STRING)
  refreshToken!: string;

  @Column(DataType.STRING)
  userAgent!: string;
}

export default TokenModel;
