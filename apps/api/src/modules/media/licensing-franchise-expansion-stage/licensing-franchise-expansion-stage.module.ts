import { Module } from '@nestjs/common';

import {
  LicensingFranchiseExpansionStageController,
} from './licensing-franchise-expansion-stage.controller';

import {
  LicensingFranchiseExpansionStageService,
} from './licensing-franchise-expansion-stage.service';

@Module({
  controllers: [LicensingFranchiseExpansionStageController],
  providers: [LicensingFranchiseExpansionStageService],
  exports: [LicensingFranchiseExpansionStageService],
})
export class LicensingFranchiseExpansionStageModule {}
