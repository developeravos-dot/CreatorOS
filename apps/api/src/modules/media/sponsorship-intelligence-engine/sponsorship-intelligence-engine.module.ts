import { Module } from '@nestjs/common';

import {
  SponsorshipIntelligenceEngineController,
} from './sponsorship-intelligence-engine.controller';

import {
  SponsorshipIntelligenceEngineService,
} from './sponsorship-intelligence-engine.service';

@Module({
  controllers: [SponsorshipIntelligenceEngineController],
  providers: [SponsorshipIntelligenceEngineService],
  exports: [SponsorshipIntelligenceEngineService],
})
export class SponsorshipIntelligenceEngineModule {}
