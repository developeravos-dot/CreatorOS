import { Module } from '@nestjs/common';

import {
  ProductionStageController,
} from './production-stage.controller';

import {
  ProductionStageService,
} from './production-stage.service';

@Module({
  controllers: [ProductionStageController],
  providers: [ProductionStageService],
  exports: [ProductionStageService],
})
export class ProductionStageModule {}
