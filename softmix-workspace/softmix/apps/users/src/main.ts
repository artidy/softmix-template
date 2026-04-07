/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { bootstrap } from '@project-lib/core';

import { AppModule } from './app/app.module';
import { seedUsers } from './app/user/user.seed';

bootstrap(AppModule, 'Users', seedUsers);
