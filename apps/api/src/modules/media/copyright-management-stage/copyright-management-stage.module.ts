import { Module } from '@nestjs/common';

import {
  CopyrightManagementStageController,
} from './copyright-management-stage.controller';

import {
  CopyrightManagementStageService,
} from './copyright-management-stage.service';

@Module({
  controllers: [
    CopyrightManagementStageController,
  ],
  providers: [
    CopyrightManagementStageService,
  ],
  exports: [
    CopyrightManagementStageService,
  ],
})
export class CopyrightManagementStageModule {}
