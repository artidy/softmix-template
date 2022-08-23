import {NextFunction, Request, Response} from 'express';

import {MiddlewareInterface} from '../../types/middleware.interface.js';
import {TokenServiceInterface} from '../../modules/token/token-service.interface.js';
import {fillDTO, verifyToken} from '../../utils/functions.js';
import {ApiTokenTypes} from '../conts.js';
import UserDto from '../../modules/user/dto/user.dto.js';
import UserServiceInterface from '../../modules/user/user-service.interface.js';

class AuthenticateMiddleware implements MiddlewareInterface {
  constructor(
    private readonly jwtSecret: string,
    private readonly jwtAlgorithm: string,
    private readonly tokenService: TokenServiceInterface,
    private readonly userService: UserServiceInterface
  ) {}

  public async execute(req: Request, res: Response, next: NextFunction): Promise<void> {
    const token = req.headers?.[ApiTokenTypes.Token];

    res.locals.userAgent = req.get('User-Agent') || '';

    if (!token) {
      return next();
    }

    try {
      const payload = await verifyToken(token as string, this.jwtSecret, this.jwtAlgorithm);
      const result = await this.tokenService.findByToken(token as string, res.locals.userAgent);
      const user = await this.userService.findById(payload.id);

      if (result && user) {
        res.locals.user = fillDTO(UserDto, user);
      }

      return next();
    } catch {

      return next();
    }
  }
}

export default AuthenticateMiddleware;
