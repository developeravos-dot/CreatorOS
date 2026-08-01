import { Module } from '@nestjs/common';

import {
  SubscriberGrowthEngineController,
} from './subscriber-growth-engine.controller';

import {
  SubscriberGrowthEngineService,
} from './subscriber-growth-engine.service';

@Module({
  controllers: [SubscriberGrowthEngineController],
  providers: [SubscriberGrowthEngineService],
  exports: [SubscriberGrowthEngineService],
})
export class SubscriberGrowthEngineModule {}
