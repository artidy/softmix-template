import { Injectable } from '@nestjs/common';
import { UserExistsException, UserNotFoundException } from '@project-lib/core';

import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  public async getAll() {
    return this.userRepository.findAll();
  }

  public async getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  public async getUserByLogin(login: string) {
    return this.userRepository.findByLogin(login);
  }

  public async getCount() {
    return this.userRepository.getCount();
  }

  public async create(dto: CreateUserDto) {
    const existUser = await this.userRepository.findByLogin(dto.login);

    if (existUser) {
      throw new UserExistsException(existUser.login);
    }

    const userEntity = new UserEntity({
      ...dto,
      createdAt: new Date(),
    });
    await userEntity.setPassword(dto.password);

    return this.userRepository.create(userEntity);
  }

  public async update(id: string, dto: UpdateUserDto) {
    const existUser = await this.userRepository.findById(id);

    if (!existUser) {
      throw new UserNotFoundException(id);
    }

    const userEntity = new UserEntity({
      ...existUser,
      ...dto
    });

    if (dto.password) {
      await userEntity.setPassword(dto.password);
    }

    return this.userRepository.update(id, userEntity);
  }

  public async delete(id: string) {
    await this.userRepository.destroy(id);
  }
}
