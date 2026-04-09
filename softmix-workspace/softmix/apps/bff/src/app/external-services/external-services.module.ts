import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';

import { ExternalServicesController } from './external-services.controller';
import { ExternalServicesService } from './external-services.service';

@Module({
  imports: [HttpModule],
  controllers: [ExternalServicesController],
  providers: [ExternalServicesService],
  exports: [ExternalServicesService],
})
export class ExternalServicesModule {}
