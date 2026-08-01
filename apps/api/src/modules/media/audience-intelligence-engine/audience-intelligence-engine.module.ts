import { Module } from '@nestjs/common';

import {
  AudienceIntelligenceEngineController,
} from './audience-intelligence-engine.controller';

import {
  AudienceIntelligenceEngineService,
} from './audience-intelligence-engine.service';

@Module({
  controllers: [AudienceIntelligenceEngineController],
  providers: [AudienceIntelligenceEngineService],
  exports: [AudienceIntelligenceEngineService],
})
export class AudienceIntelligenceEngineModule {}
