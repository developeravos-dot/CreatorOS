import { Module } from '@nestjs/common';

import {
  RegionalComplianceEngineController,
} from './regional-compliance-engine.controller';

import {
  RegionalComplianceEngineService,
} from './regional-compliance-engine.service';

@Module({
  controllers: [RegionalComplianceEngineController],
  providers: [RegionalComplianceEngineService],
  exports: [RegionalComplianceEngineService],
})
export class RegionalComplianceEngineModule {}
