import { Module } from '@nestjs/common';

import {
  FranchiseExpansionEngineController,
} from './franchise-expansion-engine.controller';

import {
  FranchiseExpansionEngineService,
} from './franchise-expansion-engine.service';

@Module({
  controllers: [FranchiseExpansionEngineController],
  providers: [FranchiseExpansionEngineService],
  exports: [FranchiseExpansionEngineService],
})
export class FranchiseExpansionEngineModule {}
