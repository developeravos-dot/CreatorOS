import { Module } from '@nestjs/common';

import {
  ContentLicensingRevenueEngineController,
} from './content-licensing-revenue-engine.controller';

import {
  ContentLicensingRevenueEngineService,
} from './content-licensing-revenue-engine.service';

@Module({
  controllers: [ContentLicensingRevenueEngineController],
  providers: [ContentLicensingRevenueEngineService],
  exports: [ContentLicensingRevenueEngineService],
})
export class ContentLicensingRevenueEngineModule {}
