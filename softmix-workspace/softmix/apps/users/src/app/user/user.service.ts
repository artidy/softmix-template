import { ConflictException, Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { UserExistsException, UserNotFoundException } from '@project-lib/core';

import { UserRepository } from './user.repository';
import { CreateUserDto } from './dto/create-user.dto';
import { UserEntity } from './user.entity';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UserService implements OnModuleInit {
  private readonly logger = new Logger(UserService.name);

  constructor(private readonly userRepository: UserRepository) {}

  public async onModuleInit(): Promise<void> {
    try {
      const updated = await this.userRepository.markEmailVerifiedForAll();
      if (updated > 0) {
        this.logger.log(`Миграция emailVerified=true для ${updated} существующих юзеров`);
      }
    } catch (error) {
      this.logger.warn(`Не удалось выполнить миграцию emailVerified: ${(error as Error).message}`);
    }
  }

  public async getAll() {
    return this.userRepository.findAll();
  }

  public async getUserById(id: string) {
    return this.userRepository.findById(id);
  }

  public async getUserByLogin(login: string) {
    return this.userRepository.findByLogin(login);
  }

  public async getUserByEmail(email: string) {
    return this.userRepository.findByEmail(email);
  }

  public async getUserByLoginOrEmail(identifier: string) {
    return this.userRepository.findByLoginOrEmail(identifier);
  }

  public async getCount() {
    return this.userRepository.getCount();
  }

  public async create(dto: CreateUserDto) {
    const existByLogin = await this.userRepository.findByLogin(dto.login);
    if (existByLogin) {
      throw new UserExistsException(existByLogin.login);
    }

    if (dto.email) {
      const existByEmail = await this.userRepository.findByEmail(dto.email);
      if (existByEmail) {
        throw new ConflictException('Пользователь с таким email уже существует');
      }
    }

    const userEntity = new UserEntity({
      ...dto,
      email: dto.email ? dto.email.toLowerCase() : undefined,
      emailVerified: false,
      createdAt: new Date(),
    });
    await userEntity.setPassword(dto.password);

    return this.userRepository.create(userEntity);
  }

  public async setEmailVerified(userId: string): Promise<void> {
    const user = await this.userRepository.findById(userId);
    if (!user) return;
    const entity = new UserEntity({ ...user, emailVerified: true });
    await this.userRepository.update(userId, entity);
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
