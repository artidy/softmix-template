import { Module } from "@nestjs/common";
import { HttpModule } from '@nestjs/axios';

import { AlstyleController } from './alstyle.controller';
import { AlstyleService } from './alstyle.service';

@Module({
  imports: [HttpModule.register({ timeout: 15000 })],
  controllers: [AlstyleController],
  providers: [AlstyleService],
})
export class AlstyleModule {}
