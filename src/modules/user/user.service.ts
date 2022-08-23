import 'reflect-metadata';
import {inject, injectable} from 'inversify';

import UserServiceInterface from './user-service.interface.js';
import UserModel from './user.model.js';
import CreateUserDto from './dto/create-user.dto.js';
import LoginUserDto from './dto/login-user.dto.js';
import Component from '../../types/component.types.js';
import {LoggerInterface} from '../../common/logger/logger.interface.js';

@injectable()
class UserService implements UserServiceInterface {
  constructor(
    @inject(Component.LoggerInterface) private logger: LoggerInterface,
  ) {}

  public async findAll(): Promise<UserModel[]> {
    return UserModel.findAll();
  }

  public async findByEmail(email: string): Promise<UserModel | null> {
    return UserModel.findOne({where: {email}});
  }

  public async findById(id: number): Promise<UserModel | null> {
    return UserModel.findOne({where: {id}});
  }

  public async create(dto: CreateUserDto, saltRounds: number): Promise<UserModel> {
    const user = await UserModel.create({email: dto.email});

    this.logger.info(`Новый пользователь ${dto.email} был создан.`);
    await user.setPassword(dto.password, saltRounds);

    return user.save();
  }

  public async verifyUser(dto: LoginUserDto): Promise<UserModel | null> {
    const user = await this.findByEmail(dto.email);

    if (!user || !await user.verifyPassword(dto.password)) {
      return null;
    }

    return user;
  }
}

export default UserService;
