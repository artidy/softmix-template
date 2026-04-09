import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

import { ExternalServicesController } from './external-services.controller';
import { ExternalServicesService } from './external-services.service';
import { ExternalServiceEntity } from './external-service.entity';
import { EncryptionService } from './encryption.service';

@Module({
  imports: [TypeOrmModule.forFeature([ExternalServiceEntity])],
  controllers: [ExternalServicesController],
  providers: [ExternalServicesService, EncryptionService],
})
export class ExternalServicesModule {}
