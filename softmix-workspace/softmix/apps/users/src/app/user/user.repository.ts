import { Injectable, Logger } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { CRUDRepository } from '@project-lib/core';
import { User } from '@project-lib/shared-types';

import { UserEntity } from './user.entity';
import { UserModel } from './user.model';

@Injectable()
export class UserRepository implements CRUDRepository<UserEntity, string, User> {
  constructor(
    @InjectModel(UserModel.name) private readonly userModel: Model<UserModel>
  ) {}

  public async findAll(): Promise<User[]> {
    return this.userModel.find();
  }

  public async getCount(): Promise<number> {
    return this.userModel.countDocuments().exec();
  }

  public async findById(id: string): Promise<User|null> {
    return this.userModel.findById(id).exec();
  }

  public async findByLogin(login: string): Promise<User|null> {
    return this.userModel.findOne({login}).exec();
  }

  public async findByEmail(email: string): Promise<User|null> {
    return this.userModel.findOne({ email: email.toLowerCase() }).exec();
  }

  public async findByLoginOrEmail(identifier: string): Promise<User|null> {
    const query = identifier.includes('@')
      ? { email: identifier.toLowerCase() }
      : { login: identifier };
    const direct = await this.userModel.findOne(query).exec();
    if (direct) return direct;
    return this.userModel.findOne({
      $or: [
        { login: identifier },
        { email: identifier.toLowerCase() },
      ],
    }).exec();
  }

  public async markEmailVerifiedForAll(): Promise<number> {
    const result = await this.userModel.updateMany(
      { $or: [{ emailVerified: { $exists: false } }, { emailVerified: null }] },
      { $set: { emailVerified: true } },
    ).exec();
    return result.modifiedCount ?? 0;
  }

  public async create(user: UserEntity): Promise<User> {
    return (new this.userModel(user)).save();
  }

  public async update(id: string, user: UserEntity): Promise<User> {
    return this.userModel.findByIdAndUpdate(id, user.toObject(), {new: true});
  }

  public async destroy(id: string): Promise<void> {
    await this.userModel.deleteOne({_id: id});

    Logger.log(`Пользователь с идентификатором ${id} удален`);
  }
}
