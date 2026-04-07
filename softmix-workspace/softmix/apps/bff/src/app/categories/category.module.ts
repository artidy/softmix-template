import { Module } from "@nestjs/common";
import { HttpModule } from '@nestjs/axios';

import { CategoryController } from './category.controller';
import { CategoryService } from './category.service';

@Module({
  imports: [HttpModule],
  controllers: [CategoryController],
  providers: [CategoryService],
})
export class CategoryModule {}
