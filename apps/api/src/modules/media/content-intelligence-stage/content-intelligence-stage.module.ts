import { Module } from '@nestjs/common';
import { ContentIntelligenceStageController } from './content-intelligence-stage.controller';
import { ContentIntelligenceStageService } from './content-intelligence-stage.service';

@Module({
  controllers: [ContentIntelligenceStageController],
  providers: [ContentIntelligenceStageService],
  exports: [ContentIntelligenceStageService],
})
export class ContentIntelligenceStageModule {}
