import { Module } from '@nestjs/common';
import { RetentionIntelligenceStageController } from './retention-intelligence-stage.controller';
import { RetentionIntelligenceStageService } from './retention-intelligence-stage.service';

@Module({
  controllers: [RetentionIntelligenceStageController],
  providers: [RetentionIntelligenceStageService],
  exports: [RetentionIntelligenceStageService],
})
export class RetentionIntelligenceStageModule {}
