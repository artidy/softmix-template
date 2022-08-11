import 'reflect-metadata';
import {injectable} from 'inversify';

import UserServiceInterface from './user-service.interface.js';
import UserModel from '../../models/user.model.js';
import CreateUserDto from './dto/create-user.dto.js';
import LoginUserDto from './dto/login-user.dto';

@injectable()
class UserService implements UserServiceInterface {
  public async findAll(): Promise<UserModel[]> {
    return UserModel.findAll();
  }

  public async findByEmail(email: string): Promise<UserModel | null> {
    return UserModel.findOne({where: {email}});
  }

  public async create(dto: CreateUserDto, saltRounds: number): Promise<UserModel> {
    const user = await UserModel.create({email: dto.email});

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
