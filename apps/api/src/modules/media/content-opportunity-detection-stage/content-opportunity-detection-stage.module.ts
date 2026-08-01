import { Module } from '@nestjs/common';
import { ContentOpportunityDetectionStageController } from './content-opportunity-detection-stage.controller';
import { ContentOpportunityDetectionStageService } from './content-opportunity-detection-stage.service';

@Module({
  controllers: [ContentOpportunityDetectionStageController],
  providers: [ContentOpportunityDetectionStageService],
  exports: [ContentOpportunityDetectionStageService],
})
export class ContentOpportunityDetectionStageModule {}
