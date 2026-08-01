import { Module } from '@nestjs/common';

import {
  IpClassificationStageController,
} from './ip-classification-stage.controller';

import {
  IpClassificationStageService,
} from './ip-classification-stage.service';

@Module({
  controllers: [
    IpClassificationStageController,
  ],
  providers: [
    IpClassificationStageService,
  ],
  exports: [
    IpClassificationStageService,
  ],
})
export class IpClassificationStageModule {}
