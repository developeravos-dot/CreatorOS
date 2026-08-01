import { Module } from '@nestjs/common';

import {
  IpRightsLicensingEngineController,
} from './ip-rights-licensing-engine.controller';

import {
  IpRightsLicensingEngineService,
} from './ip-rights-licensing-engine.service';

@Module({
  controllers: [IpRightsLicensingEngineController],
  providers: [IpRightsLicensingEngineService],
  exports: [IpRightsLicensingEngineService],
})
export class IpRightsLicensingEngineModule {}
