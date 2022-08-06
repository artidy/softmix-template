import {compare, genSalt, hash} from 'bcrypt';
import {Column, DataType, IsEmail, Model, Table} from 'sequelize-typescript';

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

  @Column(DataType.STRING)
  private password!: string;

  public async setPassword(password: string, saltRounds: number) {
    const salt = await genSalt(saltRounds);

    this.setDataValue('password', await hash(password, salt));
  }

  public getPassword(): string {
    return this.password;
  }

  public async verifyPassword(password: string): Promise<boolean> {
    return compare(password, this.password);
  }
}

export default UserModel;
