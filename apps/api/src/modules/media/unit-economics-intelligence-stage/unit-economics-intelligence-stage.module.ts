import { Module } from '@nestjs/common';
import { UnitEconomicsIntelligenceStageController } from './unit-economics-intelligence-stage.controller';
import { UnitEconomicsIntelligenceStageService } from './unit-economics-intelligence-stage.service';

@Module({
  controllers: [UnitEconomicsIntelligenceStageController],
  providers: [UnitEconomicsIntelligenceStageService],
  exports: [UnitEconomicsIntelligenceStageService],
})
export class UnitEconomicsIntelligenceStageModule {}
