import {Expose} from 'class-transformer';

class UserDto {
  @Expose()
  public id!: number;

  @Expose()
  public email!: string;
}

export default UserDto;
