import { Module } from '@nestjs/common';

import {
  AbTestingEngineController,
} from './ab-testing-engine.controller';

import {
  AbTestingEngineService,
} from './ab-testing-engine.service';

@Module({
  controllers: [AbTestingEngineController],
  providers: [AbTestingEngineService],
  exports: [AbTestingEngineService],
})
export class AbTestingEngineModule {}
