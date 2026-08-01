import { Module } from '@nestjs/common';
import { BannerIntelligenceStageController } from './banner-intelligence-stage.controller';
import { BannerIntelligenceStageService } from './banner-intelligence-stage.service';

@Module({
  controllers: [BannerIntelligenceStageController],
  providers: [BannerIntelligenceStageService],
  exports: [BannerIntelligenceStageService],
})
export class BannerIntelligenceStageModule {}
