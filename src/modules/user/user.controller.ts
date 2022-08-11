import 'reflect-metadata';
import {inject, injectable} from 'inversify';
import {Request, Response} from 'express';
import {StatusCodes} from 'http-status-codes';

import {Controller} from '../../common/controller/controller.js';
import Component from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';
import UserServiceInterface from './user-service.interface.js';
import {HttpMethod} from '../../types/http-method.enum.js';
import ValidateDtoMiddleware from '../../common/middlewares/validate-dto.middleware.js';
import CreateUserDto from './dto/create-user.dto.js';
import {fillDTO} from '../../utils/functions.js';
import UserDto from './dto/user.dto.js';
import ConfigInterface from '../../common/config/config.interface.js';
import HttpError from '../../common/errors/http-error.js';
import LoginUserDto from './dto/login-user.dto.js';
import LoggedUserDto from './dto/logged-user.dto.js';

@injectable()
class UserController extends Controller {
  constructor(
    @inject(Component.LoggerInterface) logger: LoggerInterface,
    @inject(Component.UserService) private readonly userService: UserServiceInterface,
    @inject(Component.ConfigInterface) private readonly config: ConfigInterface
  ) {
    super(logger);

    this.logger.info('Добавление роутов для пользователей...');
    this.addRoute({path: '/', method: HttpMethod.Get, handler: this.index});
    this.addRoute({
      path: '/',
      method: HttpMethod.Post,
      handler: this.create,
      middlewares: [new ValidateDtoMiddleware(CreateUserDto)]
    });
    this.addRoute({
      path: '/login',
      method: HttpMethod.Post,
      handler: this.login,
      middlewares: [new ValidateDtoMiddleware(LoginUserDto)]
    });
  }

  public async index(_req: Request, res: Response): Promise<void> {
    const result = await this.userService.findAll();

    this.ok(res, fillDTO(UserDto, result));
  }

  public async create({body}: Request<Record<string, unknown>, Record<string, unknown>,
                        CreateUserDto>, res: Response): Promise<void> {
    const user = await this.userService.findByEmail(body.email);

    if (user) {
      throw new HttpError(
        StatusCodes.UNPROCESSABLE_ENTITY,
        `Пользователь с email: ${body.email} уже существует.`,
        'UserController',
      )
    }

    const result = await this.userService.create(body, this.config.get('SALT_ROUNDS'));

    this.created(res, fillDTO(UserDto, result));
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

    this.ok(res, fillDTO(LoggedUserDto, {id: user.id, email: user.email, token: 'user-pro'}));
  }

}

export default UserController;
