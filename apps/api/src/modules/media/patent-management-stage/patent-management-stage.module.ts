import { Module } from '@nestjs/common';

import {
  PatentManagementStageController,
} from './patent-management-stage.controller';

import {
  PatentManagementStageService,
} from './patent-management-stage.service';

@Module({
  controllers: [
    PatentManagementStageController,
  ],
  providers: [
    PatentManagementStageService,
  ],
  exports: [
    PatentManagementStageService,
  ],
})
export class PatentManagementStageModule {}
