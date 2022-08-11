import {Expose} from 'class-transformer';

class LoggedUserDto {
  @Expose()
  public id!: number;

  @Expose()
  public email!: string;

  @Expose()
  public token!: number;
}

export default LoggedUserDto;
