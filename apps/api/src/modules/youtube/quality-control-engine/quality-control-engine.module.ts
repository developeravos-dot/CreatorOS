import { Module } from '@nestjs/common';

import {
  QualityControlEngineController,
} from './quality-control-engine.controller';

import {
  QualityControlEngineService,
} from './quality-control-engine.service';

@Module({
  controllers: [QualityControlEngineController],
  providers: [QualityControlEngineService],
  exports: [QualityControlEngineService],
})
export class QualityControlEngineModule {}
