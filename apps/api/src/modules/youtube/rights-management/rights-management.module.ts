import { Module } from '@nestjs/common';

import {
  RightsManagementController,
} from './rights-management.controller';

import {
  RightsManagementService,
} from './rights-management.service';

@Module({
  controllers: [RightsManagementController],
  providers: [RightsManagementService],
  exports: [RightsManagementService],
})
export class RightsManagementModule {}
