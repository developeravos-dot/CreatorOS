import { Module } from '@nestjs/common';

import {
  IpFamilyTreeStageController,
} from './ip-family-tree-stage.controller';

import {
  IpFamilyTreeStageService,
} from './ip-family-tree-stage.service';

@Module({
  controllers: [
    IpFamilyTreeStageController,
  ],
  providers: [
    IpFamilyTreeStageService,
  ],
  exports: [
    IpFamilyTreeStageService,
  ],
})
export class IpFamilyTreeStageModule {}
