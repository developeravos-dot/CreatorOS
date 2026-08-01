import { Module } from '@nestjs/common';

import {
  OpportunityDiscoveryStageController,
} from './opportunity-discovery-stage.controller';

import {
  OpportunityDiscoveryStageService,
} from './opportunity-discovery-stage.service';

@Module({
  controllers: [OpportunityDiscoveryStageController],
  providers: [OpportunityDiscoveryStageService],
  exports: [OpportunityDiscoveryStageService],
})
export class OpportunityDiscoveryStageModule {}
