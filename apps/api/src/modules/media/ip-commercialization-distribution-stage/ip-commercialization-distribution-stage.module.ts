import { Module } from '@nestjs/common';

import {
  IpCommercializationDistributionStageController,
} from './ip-commercialization-distribution-stage.controller';

import {
  IpCommercializationDistributionStageService,
} from './ip-commercialization-distribution-stage.service';

@Module({
  controllers: [
    IpCommercializationDistributionStageController,
  ],
  providers: [
    IpCommercializationDistributionStageService,
  ],
  exports: [
    IpCommercializationDistributionStageService,
  ],
})
export class IpCommercializationDistributionStageModule {}
