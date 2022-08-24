import {NextFunction, Request, Response} from 'express';

import {MiddlewareInterface} from '../../types/middleware.interface.js';
import {TokenServiceInterface} from '../../modules/token/token-service.interface.js';
import {ApiTokenTypes} from '../const.js';
import {fillDTO, verifyToken} from '../../utils/functions.js';
import UserDto from '../../modules/user/dto/user.dto.js';
import TokenDto from '../../modules/token/dto/token.dto.js';
import UserServiceInterface from '../../modules/user/user-service.interface.js';

class UpdateRefreshTokenMiddleware implements MiddlewareInterface {
  constructor(
    private readonly jwtSecret: string,
    private readonly jwtAlgorithm: string,
    private readonly tokenService: TokenServiceInterface,
    private readonly userService: UserServiceInterface
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.headers?.[ApiTokenTypes.RefreshToken];

    if (res.locals.user || !token) {
      return next();
    }

    try {
      const payload = await verifyToken(token as string, this.jwtSecret, this.jwtAlgorithm);
      const tokens = await this.tokenService.create({id: payload.id, email: payload.email}, res.locals.userAgent);
      const user = await this.userService.findById(tokens.userId);

      if (!user) {
        return next();
      }

      res.locals.user = fillDTO(UserDto, user);
      res.locals.newTokens = fillDTO(TokenDto, tokens);

      return next();
    } catch {

      return next();
    }
  }
}

export default UpdateRefreshTokenMiddleware;
