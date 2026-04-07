/**
 * This is not a production server yet!
 * This is only a minimal backend to get started.
 */
import { bootstrap, checkAuth } from '@project-lib/core';

import { AppModule } from './app/app.module';

bootstrap(AppModule, 'Shop', checkAuth);
