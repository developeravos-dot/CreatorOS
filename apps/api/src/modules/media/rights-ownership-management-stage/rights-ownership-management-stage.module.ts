import { Module } from '@nestjs/common';

import {
  RightsOwnershipManagementStageController,
} from './rights-ownership-management-stage.controller';

import {
  RightsOwnershipManagementStageService,
} from './rights-ownership-management-stage.service';

@Module({
  controllers: [
    RightsOwnershipManagementStageController,
  ],
  providers: [
    RightsOwnershipManagementStageService,
  ],
  exports: [
    RightsOwnershipManagementStageService,
  ],
})
export class RightsOwnershipManagementStageModule {}
