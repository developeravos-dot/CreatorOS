import { Module } from '@nestjs/common';

import {
  ReportingEngineController,
} from './reporting-engine.controller';

import {
  ReportingEngineService,
} from './reporting-engine.service';

@Module({
  controllers: [ReportingEngineController],
  providers: [ReportingEngineService],
  exports: [ReportingEngineService],
})
export class ReportingEngineModule {}
