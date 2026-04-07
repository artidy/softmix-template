import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Token } from '@project-lib/core';

import { RefreshTokenModel } from './refresh-token.model';
import { RefreshTokenEntity } from './refresh-token.entity';

export class RefreshTokenRepository {
  constructor(
    @InjectModel(RefreshTokenModel.name) private readonly refreshTokenModel: Model<RefreshTokenModel>) {
  }

  public async findByTokenId(tokenId: string): Promise<Token | null> {
    return this.refreshTokenModel
      .findOne({ tokenId })
      .exec();
  }

  public async create(token: RefreshTokenEntity): Promise<Token> {
    return new this.refreshTokenModel(token).save();
  }

  public async deleteByTokenId(tokenId: string) {
    return this.refreshTokenModel
      .deleteOne({ tokenId });
  }

  public async deleteExpiredTokens() {
    return this.refreshTokenModel
      .deleteMany({ expiresIn: { $lt: new Date()}})
  }
}
