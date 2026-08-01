import { Module } from '@nestjs/common';
import { DirectingIntelligenceStageController } from './directing-intelligence-stage.controller';
import { DirectingIntelligenceStageService } from './directing-intelligence-stage.service';

@Module({
  controllers: [DirectingIntelligenceStageController],
  providers: [DirectingIntelligenceStageService],
  exports: [DirectingIntelligenceStageService],
})
export class DirectingIntelligenceStageModule {}
