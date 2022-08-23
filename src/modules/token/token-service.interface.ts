import CreateTokenDto from './dto/create-token.dto.js';
import Payload from '../../types/payload.js';
import TokenModel from './token.model.js';

interface TokenServiceInterface {
  create(payload: Payload, userAgent: string): Promise<TokenModel>;
  generateTokens(payload: Payload): Promise<CreateTokenDto>;
  updateTokens(refreshToken: string, userAgent: string): Promise<CreateTokenDto | null>;
  findByToken(token: string, userAgent: string): Promise<TokenModel | null>;
  deleteByToken(token: string): Promise<number>;
  findByUserAgent(userId: number, userAgent: string): Promise<TokenModel | null>;
}

export {TokenServiceInterface};
