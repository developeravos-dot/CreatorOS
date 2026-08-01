import { Module } from '@nestjs/common';

import {
  AdvertisingRevenueEngineController,
} from './advertising-revenue-engine.controller';

import {
  AdvertisingRevenueEngineService,
} from './advertising-revenue-engine.service';

@Module({
  controllers: [AdvertisingRevenueEngineController],
  providers: [AdvertisingRevenueEngineService],
  exports: [AdvertisingRevenueEngineService],
})
export class AdvertisingRevenueEngineModule {}
