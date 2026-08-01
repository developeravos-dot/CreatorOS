import { Module } from '@nestjs/common';

import {
  IpFamilyTreeEngineController,
} from './ip-family-tree-engine.controller';

import {
  IpFamilyTreeEngineService,
} from './ip-family-tree-engine.service';

@Module({
  controllers: [IpFamilyTreeEngineController],
  providers: [IpFamilyTreeEngineService],
  exports: [IpFamilyTreeEngineService],
})
export class IpFamilyTreeEngineModule {}
