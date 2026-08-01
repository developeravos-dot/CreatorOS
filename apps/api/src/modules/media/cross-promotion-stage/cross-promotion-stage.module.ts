import { Module } from '@nestjs/common';
import { CrossPromotionStageController } from './cross-promotion-stage.controller';
import { CrossPromotionStageService } from './cross-promotion-stage.service';

@Module({
  controllers: [CrossPromotionStageController],
  providers: [CrossPromotionStageService],
  exports: [CrossPromotionStageService],
})
export class CrossPromotionStageModule {}
