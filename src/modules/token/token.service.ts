import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {Op} from 'sequelize';

import {TokenServiceInterface} from './token-service.interface.js';
import CreateTokenDto from './dto/create-token.dto.js';
import {createJWT, verifyToken} from '../../utils/functions.js';
import Payload from '../../types/payload.js';
import TokenModel from './token.model.js';
import Component from '../../types/component.types.js';
import ConfigInterface from '../../common/config/config.interface.js';

@injectable()
class TokenService implements TokenServiceInterface {
  constructor(
    @inject(Component.ConfigInterface) private readonly config: ConfigInterface
  ) {}

  public async create(payload: Payload, userAgent: string): Promise<TokenModel> {

    const tokens = await this.generateTokens(payload);
    const tokensModel = await this.findByUserAgent(payload.id, userAgent) ||
      await TokenModel.create({
        userId: payload.id,
        userAgent
      });

    tokensModel.token = tokens.token;
    tokensModel.refreshToken = tokens.refreshToken;

    await tokensModel.save();

    return tokensModel;
  }

  public async generateTokens(payload: Payload): Promise<CreateTokenDto> {
    const token = await createJWT(
      this.config.get('JWT_ALGORITHM'),
      this.config.get('JWT_SECRET'),
      payload
    );

    const refreshToken = await createJWT(
      this.config.get('JWT_ALGORITHM'),
      this.config.get('JWT_REFRESH_SECRET'),
      payload,
      this.config.get('TOKEN_EXPIRATION_TIME')
    );

    return {userId: payload.id, token, refreshToken};
  }

  public async updateTokens(refreshToken: string, userAgent: string): Promise<CreateTokenDto | null> {
    try {
      const payload = await verifyToken(refreshToken, this.config.get('JWT_REFRESH_SECRET'), this.config.get('JWT_ALGORITHM'));
      const result = await this.findByToken(refreshToken, userAgent);

      if (!result) {
        return null;
      }

      return this.generateTokens(payload);
    } catch {

      return null;
    }
  }

  public async findByToken(token: string, userAgent: string): Promise<TokenModel | null> {
    return TokenModel.findOne({
      where: {
        [Op.and]: [
          {[Op.or]: [
            {token},
            {refreshToken: token}
          ]},
          {userAgent}
        ]
      }
    });
  }

  public async deleteByToken(token: string): Promise<number> {
    return TokenModel.destroy({
      where: {
        [Op.or]: [
          {token},
          {refreshToken: token}
        ]
      }
    });
  }

  public async findByUserAgent(userId: number, userAgent: string): Promise<TokenModel | null> {
    return TokenModel.findOne({where: {userId, userAgent}})
  }
}

export default TokenService;
