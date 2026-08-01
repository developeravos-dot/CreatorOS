import { Module } from '@nestjs/common';

import {
  LicensingIntelligenceController,
} from './licensing-intelligence.controller';

import {
  LicensingIntelligenceService,
} from './licensing-intelligence.service';

@Module({
  controllers: [LicensingIntelligenceController],
  providers: [LicensingIntelligenceService],
  exports: [LicensingIntelligenceService],
})
export class LicensingIntelligenceModule {}
