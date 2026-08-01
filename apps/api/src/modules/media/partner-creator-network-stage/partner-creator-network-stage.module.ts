import { Module } from '@nestjs/common';

import {
  PartnerCreatorNetworkStageController,
} from './partner-creator-network-stage.controller';

import {
  PartnerCreatorNetworkStageService,
} from './partner-creator-network-stage.service';

@Module({
  controllers: [PartnerCreatorNetworkStageController],
  providers: [PartnerCreatorNetworkStageService],
  exports: [PartnerCreatorNetworkStageService],
})
export class PartnerCreatorNetworkStageModule {}
