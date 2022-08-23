import {Expose} from 'class-transformer';

class User {
  @Expose()
  public id!: number;

  @Expose()
  public email!: string;

  @Expose()
  public name!: string;
}

export default User;
