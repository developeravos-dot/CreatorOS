import { Module } from '@nestjs/common';

import {
  MultiPlatformDistributionStageController,
} from './multi-platform-distribution-stage.controller';

import {
  MultiPlatformDistributionStageService,
} from './multi-platform-distribution-stage.service';

@Module({
  controllers: [MultiPlatformDistributionStageController],
  providers: [MultiPlatformDistributionStageService],
  exports: [MultiPlatformDistributionStageService],
})
export class MultiPlatformDistributionStageModule {}
