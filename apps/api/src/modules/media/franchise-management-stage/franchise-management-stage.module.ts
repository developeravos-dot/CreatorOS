import { Module } from '@nestjs/common';

import {
  FranchiseManagementStageController,
} from './franchise-management-stage.controller';

import {
  FranchiseManagementStageService,
} from './franchise-management-stage.service';

@Module({
  controllers: [
    FranchiseManagementStageController,
  ],
  providers: [
    FranchiseManagementStageService,
  ],
  exports: [
    FranchiseManagementStageService,
  ],
})
export class FranchiseManagementStageModule {}
