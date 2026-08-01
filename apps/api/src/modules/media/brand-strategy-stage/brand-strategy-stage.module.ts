import { Module } from '@nestjs/common';
import { BrandStrategyStageController } from './brand-strategy-stage.controller';
import { BrandStrategyStageService } from './brand-strategy-stage.service';

@Module({
  controllers: [BrandStrategyStageController],
  providers: [BrandStrategyStageService],
  exports: [BrandStrategyStageService],
})
export class BrandStrategyStageModule {}
