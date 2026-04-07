import { Inject, Injectable } from '@nestjs/common';
import { ConfigType } from '@nestjs/config';
import dayjs, { ManipulateType } from 'dayjs';
import { RefreshTokenPayload } from '@project-lib/core';

import { RefreshTokenEntity } from './refresh-token.entity';
import { RefreshTokenRepository } from './refresh-token.repository';
import { jwtConfig } from '../../config/jwt.config';

@Injectable()
export class RefreshTokenService {
  constructor(
    private readonly refreshTokenRepository: RefreshTokenRepository,
    @Inject(jwtConfig.KEY) private readonly config: ConfigType<typeof jwtConfig>,
  ) {}

  public async createRefreshSession(payload: RefreshTokenPayload) {
    const count = +this.config.refreshExpiresIn.slice(0, -1);
    const unit  =  this.config.refreshExpiresIn.at(-1);
    const refreshToken = new RefreshTokenEntity({
      tokenId: payload.refreshTokenId,
      createdAt: null,
      userId: payload.id,
      expiresIn: dayjs().add(count, unit as ManipulateType).toDate()
    });

    return this.refreshTokenRepository.create(refreshToken);
  }

  public async deleteRefreshSession(tokenId?: string) {
    if (!tokenId) {
      return;
    }

    await this.deleteExpiredRefreshTokens();

    return this.refreshTokenRepository.deleteByTokenId(tokenId)
  }

  public async isExists(tokenId: string): Promise<boolean> {
    const refreshToken = await this.refreshTokenRepository.findByTokenId(tokenId);

    return (refreshToken !== null);
  }

  public async deleteExpiredRefreshTokens() {
    return this.refreshTokenRepository.deleteExpiredTokens();
  }
}
