import { Module } from '@nestjs/common';
import { CommerceIntelligenceStageController } from './commerce-intelligence-stage.controller';
import { CommerceIntelligenceStageService } from './commerce-intelligence-stage.service';

@Module({
  controllers: [CommerceIntelligenceStageController],
  providers: [CommerceIntelligenceStageService],
  exports: [CommerceIntelligenceStageService],
})
export class CommerceIntelligenceStageModule {}
