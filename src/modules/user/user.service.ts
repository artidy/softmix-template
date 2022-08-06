import 'reflect-metadata';
import {injectable} from 'inversify';

import UserServiceInterface from './user-service.interface.js';
import UserModel from '../../models/user.model.js';
import CreateUserDto from './dto/create-user.dto.js';

@injectable()
class UserService implements UserServiceInterface {
  public async findAll(): Promise<UserModel[]> {
    return UserModel.findAll();
  }

  public async findByEmail(email: string): Promise<UserModel | null> {
    return UserModel.findOne({where: {email}});
  }

  public async create(dto: CreateUserDto, saltRounds: number): Promise<UserModel> {
    return UserModel.create({email: dto.email, password: {password: dto.password, saltRounds}});
  }
}

export default UserService;
