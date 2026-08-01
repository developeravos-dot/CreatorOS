import { Module } from '@nestjs/common';

import {
  VisualProductionEngineController,
} from './visual-production-engine.controller';

import {
  VisualProductionEngineService,
} from './visual-production-engine.service';

@Module({
  controllers: [VisualProductionEngineController],
  providers: [VisualProductionEngineService],
  exports: [VisualProductionEngineService],
})
export class VisualProductionEngineModule {}
