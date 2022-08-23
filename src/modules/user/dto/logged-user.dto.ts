import {Expose} from 'class-transformer';

import User from './user.dto.js';

class LoggedUserDto extends User {
  @Expose()
  public token!: number;

  @Expose()
  public refreshToken!: number;
}

export default LoggedUserDto;
