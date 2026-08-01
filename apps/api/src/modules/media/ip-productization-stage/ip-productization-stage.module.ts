import { Module } from '@nestjs/common';

import {
  IpProductizationStageController,
} from './ip-productization-stage.controller';

import {
  IpProductizationStageService,
} from './ip-productization-stage.service';

@Module({
  controllers: [
    IpProductizationStageController,
  ],
  providers: [
    IpProductizationStageService,
  ],
  exports: [
    IpProductizationStageService,
  ],
})
export class IpProductizationStageModule {}
