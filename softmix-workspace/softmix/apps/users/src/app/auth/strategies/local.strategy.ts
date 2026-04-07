import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy } from 'passport-local';

import { AuthService } from '../auth.service';
import { UserEntity } from '../../user/user.entity';

const USERNAME_FIELD_NAME = 'login';

@Injectable()
export class LocalStrategy extends PassportStrategy(Strategy) {
  constructor(
    private authService: AuthService
  ) {
    super({
      usernameField: USERNAME_FIELD_NAME
    });
  }

  public async validate(login: string, password: string): Promise<UserEntity> {
    return this.authService.verifyUser({ login, password });
  }
}
