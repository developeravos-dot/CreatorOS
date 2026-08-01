import { Module } from '@nestjs/common';

import {
  IpAssetDiscoveryStageController,
} from './ip-asset-discovery-stage.controller';

import {
  IpAssetDiscoveryStageService,
} from './ip-asset-discovery-stage.service';

@Module({
  controllers: [
    IpAssetDiscoveryStageController,
  ],
  providers: [
    IpAssetDiscoveryStageService,
  ],
  exports: [
    IpAssetDiscoveryStageService,
  ],
})
export class IpAssetDiscoveryStageModule {}
