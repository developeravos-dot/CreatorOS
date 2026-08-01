import { Module } from '@nestjs/common';

import {
  MediaIpRegistryEngineModule,
} from '../media-ip-registry-engine/media-ip-registry-engine.module';

import {
  IpDigitalDnaEngineModule,
} from '../ip-digital-dna-engine/ip-digital-dna-engine.module';

import {
  IpFamilyTreeEngineModule,
} from '../ip-family-tree-engine/ip-family-tree-engine.module';

import {
  FranchiseExpansionEngineModule,
} from '../franchise-expansion-engine/franchise-expansion-engine.module';

import {
  IpRightsLicensingEngineModule,
} from '../ip-rights-licensing-engine/ip-rights-licensing-engine.module';

@Module({
  imports: [
    MediaIpRegistryEngineModule,
    IpDigitalDnaEngineModule,
    IpFamilyTreeEngineModule,
    FranchiseExpansionEngineModule,
    IpRightsLicensingEngineModule,
  ],
  exports: [
    MediaIpRegistryEngineModule,
    IpDigitalDnaEngineModule,
    IpFamilyTreeEngineModule,
    FranchiseExpansionEngineModule,
    IpRightsLicensingEngineModule,
  ],
})
export class AvosMediaIpFranchiseMegaModule {}
