import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

import {Controller} from '../../common/controller/controller.js';
import Component from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import UserServiceInterface from './user-service.interface.js';
import ValidateDtoMiddleware from '../../common/middlewares/validate-dto.middleware.js';
import {fillDTO} from '../../utils/functions.js';
import UserDto from './dto/user.dto.js';
import HttpError from '../../common/errors/http-error.js';
import LoginUserDto from './dto/login-user.dto.js';
import LoggedUserDto from './dto/logged-user.dto.js';
import {HttpMethod} from '../../common/const.js';
import {TokenServiceInterface} from '../token/token-service.interface.js';
import PrivateRouteMiddleware from '../../common/middlewares/private-route.middleware.js';

@injectable()
class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserServiceInterface) private readonly userService: UserServiceInterface,
    @inject(Component.TokenServiceInterface) private tokenService: TokenServiceInterface
  ) {
    super(logger);

    this.logger.info('Добавление роутов для пользователей...');
    this.addRoute({
      path: '/',
      method: HttpMethod.Get,
      handler: this.index,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
    this.addRoute({
      path: '/check-auth',
      method: HttpMethod.Get,
      handler: this.checkAuth,
      middlewares: [new PrivateRouteMiddleware()]
    });
    this.addRoute({
      path: '/logout',
      method: HttpMethod.Delete,
      handler: this.logout,
      middlewares: [new PrivateRouteMiddleware()]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const result = await this.userService.findAll();

    this.ok(res, fillDTO(UserDto, result));
  }

  public async login({body}: Request<Record<string, unknown>, Record<string, unknown>, LoginUserDto>,
                     res: Response): Promise<void> {
    const user = await this.userService.verifyUser(body);

    if (!user) {
      throw new HttpError(
        StatusCodes.UNAUTHORIZED,
        'Не прошли авторизацию',
        'UserController'
      );
    }

    if (res.locals.user) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Вы уже авторизованы',
        'UserController'
      );
    }

    const tokens = await this.tokenService.create({id: user.id, email: user.email}, res.locals.userAgent);

    this.ok(res, fillDTO(LoggedUserDto, {
      id: user.id,
      email: user.email,
      name: user.name,
      token: tokens.token,
      refreshToken: tokens.refreshToken
    }));
  }

  public async checkAuth(_req: Request, res: Response): Promise<void> {
    const {user, userAgent} = res.locals;
    const tokens = await this.tokenService.findByUserAgent(user.id, userAgent);

    if (!user) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Не найден пользователь',
        'UserController'
      );
    }

    if (!tokens) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Не найдены токены',
        'UserController'
      );
    }

    this.ok(res, fillDTO(LoggedUserDto, {
      id: user.id,
      email: user.email,
      name: user.name,
      token: tokens.token,
      refreshToken: tokens.refreshToken
    }));
  }

  public async logout(_req: Request, res: Response): Promise<void> {
    const {user, userAgent} = res.locals;
    const tokens = await this.tokenService.findByUserAgent(user.id, userAgent);

    if (!tokens) {
      throw new HttpError(
        StatusCodes.BAD_REQUEST,
        'Не найдены токены',
        'UserController'
      );
    }

    tokens.token = "";
    tokens.refreshToken = "";
    res.locals.newTokens = undefined;

    await tokens.save();

    this.noContent(res);
  }
}

export default UserController;
