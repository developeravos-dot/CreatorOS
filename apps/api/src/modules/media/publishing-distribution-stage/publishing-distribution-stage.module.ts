import { Module } from '@nestjs/common';

import {
  PublishingDistributionStageController,
} from './publishing-distribution-stage.controller';

import {
  PublishingDistributionStageService,
} from './publishing-distribution-stage.service';

@Module({
  controllers: [PublishingDistributionStageController],
  providers: [PublishingDistributionStageService],
  exports: [PublishingDistributionStageService],
})
export class PublishingDistributionStageModule {}
