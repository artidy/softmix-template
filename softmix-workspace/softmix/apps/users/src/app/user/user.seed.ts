import { INestApplication } from '@nestjs/common';
import { UserRole } from '@project-lib/shared-types';
import { ConfigService } from '@nestjs/config';

import { UserService } from './user.service';

export async function seedUsers(app: INestApplication) {
  const userService = app.get<UserService>(UserService);
  const configService = app.get<ConfigService>(ConfigService);

  const userCount = await userService.getCount();

  if (userCount > 0) {
    return;
  }

  const data = [
    {
      name: 'Admin',
      login: configService.get<string>('user.login'),
      password: configService.get<string>('user.password'),
      role: UserRole.Admin
    },
  ];


  for (const item of data) {
    await userService.create(item);
  }

  console.log('Users seeded successfully');
}
