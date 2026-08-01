import { Module } from '@nestjs/common';
import { BrandBookStageController } from './brand-book-stage.controller';
import { BrandBookStageService } from './brand-book-stage.service';

@Module({
  controllers: [BrandBookStageController],
  providers: [BrandBookStageService],
  exports: [BrandBookStageService],
})
export class BrandBookStageModule {}
