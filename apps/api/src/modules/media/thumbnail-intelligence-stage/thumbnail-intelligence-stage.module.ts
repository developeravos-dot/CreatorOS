import { Module } from '@nestjs/common';
import { ThumbnailIntelligenceStageController } from './thumbnail-intelligence-stage.controller';
import { ThumbnailIntelligenceStageService } from './thumbnail-intelligence-stage.service';

@Module({
  controllers: [ThumbnailIntelligenceStageController],
  providers: [ThumbnailIntelligenceStageService],
  exports: [ThumbnailIntelligenceStageService],
})
export class ThumbnailIntelligenceStageModule {}
