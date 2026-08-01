import { Module } from '@nestjs/common';

import {
  TrademarkManagementStageController,
} from './trademark-management-stage.controller';

import {
  TrademarkManagementStageService,
} from './trademark-management-stage.service';

@Module({
  controllers: [
    TrademarkManagementStageController,
  ],
  providers: [
    TrademarkManagementStageService,
  ],
  exports: [
    TrademarkManagementStageService,
  ],
})
export class TrademarkManagementStageModule {}
