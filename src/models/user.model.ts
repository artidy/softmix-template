import {compare, genSalt, hash} from 'bcrypt';
import {Column, DataType, IsEmail, Model, Table} from 'sequelize-typescript';

type PasswordData = {
  password: string;
  saltRounds: number;
}

@Table({
  tableName: 'users',
  timestamps: true
})
class UserModel extends Model {
  @IsEmail
  @Column({
    type: DataType.STRING,
    unique: true
  })
  email!: string;

  @Column({
    type: DataType.STRING,
    async set(passwordData: PasswordData) {
      const salt = await genSalt(passwordData.saltRounds);

      this.setDataValue('password', await hash(passwordData.password, salt));
    }
  })
  password!: string;

  public async verifyPassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}

export default UserModel;
