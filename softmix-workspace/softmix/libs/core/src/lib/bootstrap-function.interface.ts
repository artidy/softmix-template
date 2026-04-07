import { INestApplication } from '@nestjs/common';

export interface BootstrapFunction {
  (app: INestApplication): void
}
