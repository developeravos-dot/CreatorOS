import { Module } from '@nestjs/common';

import {
  AudienceGrowthEngineController,
} from './audience-growth-engine.controller';

import {
  AudienceGrowthEngineService,
} from './audience-growth-engine.service';

@Module({
  controllers: [AudienceGrowthEngineController],
  providers: [AudienceGrowthEngineService],
  exports: [AudienceGrowthEngineService],
})
export class AudienceGrowthEngineModule {}
