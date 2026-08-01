import { Module } from '@nestjs/common';

import {
  GlobalDistributionCenterController,
} from './global-distribution-center.controller';

import {
  GlobalDistributionCenterService,
} from './global-distribution-center.service';

@Module({
  controllers: [GlobalDistributionCenterController],
  providers: [GlobalDistributionCenterService],
  exports: [GlobalDistributionCenterService],
})
export class GlobalDistributionCenterModule {}
