import { Module } from '@nestjs/common';

import {
  LicensingManagementStageController,
} from './licensing-management-stage.controller';

import {
  LicensingManagementStageService,
} from './licensing-management-stage.service';

@Module({
  controllers: [
    LicensingManagementStageController,
  ],
  providers: [
    LicensingManagementStageService,
  ],
  exports: [
    LicensingManagementStageService,
  ],
})
export class LicensingManagementStageModule {}
