import { ForbiddenException, Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { randomUUID } from 'crypto';
import {
  convertTimeToSeconds,
  RefreshTokenPayload,
  TokenPayload,
  UserNotRegisteredException,
  UserPasswordWrongException
} from '@project-lib/core';
import { getCurrentSeconds, User } from '@project-lib/shared-types';

import { jwtConfig } from '../../config/jwt.config';
import { RefreshTokenService } from '../refresh-token/refresh-token.service';
import { LoginUserDto } from './dto/login-user.dto';
import { UserRepository } from '../user/user.repository';
import { UserEntity } from '../user/user.entity';
import { LoggedUserRdo } from './rdo/logged-user.rdo';

@Injectable()
export class AuthService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly jwtService: JwtService,
    private readonly refreshTokenService: RefreshTokenService,
    @Inject (jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  public async verifyUser({login, password}: LoginUserDto) {
    const existUser = await this.userRepository.findByLoginOrEmail(login);

    if (!existUser) {
      throw new UserNotRegisteredException(login);
    }

    const userEntity = new UserEntity(existUser);

    if (! await userEntity.comparePassword(password)) {
      throw new UserPasswordWrongException();
    }

    if (existUser.email && existUser.emailVerified === false) {
      throw new ForbiddenException({
        statusCode: 403,
        code: 'EMAIL_NOT_VERIFIED',
        message: 'Подтвердите email — мы отправили вам письмо со ссылкой',
      });
    }

    return userEntity.toObject();
  }

  public async loginUser(user: Pick<User, '_id' | 'login' | 'role' | 'name'>, refreshTokenId?: string): Promise<LoggedUserRdo> {
    const payload: TokenPayload = {
      id: user._id ?? '',
      login: user.login,
      role: user.role,
      name: user.name,
    };

    await this.refreshTokenService.deleteRefreshSession(refreshTokenId);

    const refreshTokenPayload: RefreshTokenPayload = {
      ...payload, refreshTokenId: randomUUID()
    }

    await this.refreshTokenService.createRefreshSession(refreshTokenPayload);

    return {
      accessToken: await this.jwtService.signAsync(payload),
      refreshToken: await this.jwtService.signAsync(refreshTokenPayload, {
        secret: this.config.refreshSecret,
        expiresIn: this.config.refreshExpiresIn,
      }),
      expiresIn: getCurrentSeconds() + convertTimeToSeconds(this.config.expiresIn),
    };
  }

  public async logout(refreshTokenId: string) {
    await this.refreshTokenService.deleteRefreshSession(refreshTokenId);
  }
}
