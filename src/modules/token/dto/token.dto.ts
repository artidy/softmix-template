import {Expose, Type} from 'class-transformer';

import UserModel from '../../user/user.model.js';

class TokenDto {
  @Expose()
  @Type(() => UserModel)
  public user!: UserModel;

  @Expose()
  public token!: string;

  @Expose()
  public refreshToken!: string;
}

export default TokenDto;
