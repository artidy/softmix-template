import { Module } from "@nestjs/common";
import { HttpModule } from '@nestjs/axios';

import { UploaderController } from './uploader.controller';
import { UploaderService } from './uploader.service';

@Module({
  imports: [HttpModule],
  controllers: [UploaderController],
  providers: [UploaderService],
})
export class UploaderModule {}
