import {compare, genSalt, hash} from 'bcrypt';
import { User, UserRole } from '@project-lib/shared-types';

import { SALT_ROUNDS } from '../app.constant';

export class UserEntity implements User {
  public _id: string;
  public name: string;
  public login: string;
  public role: UserRole;
  public passwordHash: string;
  public email?: string;
  public emailVerified?: boolean;
  public phone?: string;
  public address?: string;
  public createdAt: Date;

  constructor(user: User) {
    this.fillEntity(user);
  }

  public toObject() {
    return {...this};
  }

  public async setPassword(password: string): Promise<UserEntity> {
    const salt = await genSalt(SALT_ROUNDS);

    this.passwordHash = await hash(password, salt);

    return this;
  }

  public async comparePassword(password: string): Promise<boolean> {
    return compare(password, this.passwordHash);
  }

  public fillEntity(entity: User): void {
    this._id = entity._id;
    this.name = entity.name;
    this.login = entity.login;
    this.role = entity.role;
    this.passwordHash = entity.passwordHash;
    this.email = entity.email;
    this.emailVerified = entity.emailVerified ?? false;
    this.phone = entity.phone;
    this.address = entity.address;
  }
}
