import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ServiceProxyController } from './service-proxy.controller';
import { ServiceProxyService } from './service-proxy.service';

@Module({
  imports: [HttpModule.register({ timeout: 15000 })],
  controllers: [ServiceProxyController],
  providers: [ServiceProxyService],
})
export class ServiceProxyModule {}
