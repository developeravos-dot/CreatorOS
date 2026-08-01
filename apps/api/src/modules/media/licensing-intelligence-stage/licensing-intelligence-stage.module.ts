import { Module } from '@nestjs/common';
import { LicensingIntelligenceStageController } from './licensing-intelligence-stage.controller';
import { LicensingIntelligenceStageService } from './licensing-intelligence-stage.service';

@Module({
  controllers: [LicensingIntelligenceStageController],
  providers: [LicensingIntelligenceStageService],
  exports: [LicensingIntelligenceStageService],
})
export class LicensingIntelligenceStageModule {}
