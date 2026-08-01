import { Module } from '@nestjs/common';
import { AudienceSegmentationStageController } from './audience-segmentation-stage.controller';
import { AudienceSegmentationStageService } from './audience-segmentation-stage.service';

@Module({
  controllers: [AudienceSegmentationStageController],
  providers: [AudienceSegmentationStageService],
  exports: [AudienceSegmentationStageService],
})
export class AudienceSegmentationStageModule {}
