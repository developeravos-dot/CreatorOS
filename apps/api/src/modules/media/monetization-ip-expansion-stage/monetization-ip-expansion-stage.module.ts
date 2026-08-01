import { Module } from '@nestjs/common';

import {
  MonetizationIpExpansionStageController,
} from './monetization-ip-expansion-stage.controller';

import {
  MonetizationIpExpansionStageService,
} from './monetization-ip-expansion-stage.service';

@Module({
  controllers: [MonetizationIpExpansionStageController],
  providers: [MonetizationIpExpansionStageService],
  exports: [MonetizationIpExpansionStageService],
})
export class MonetizationIpExpansionStageModule {}
