import { MediaEnterprisePlatformModule } from './media-enterprise-platform/media-enterprise-platform.module';
import { MediaIntelligencePlatformModule } from './media-intelligence-platform/media-intelligence-platform.module';
import { MediaEmpireCommandModule } from './media-empire-command/media-empire-command.module';
import { Module } from '@nestjs/common';

import {
  AvosMediaCoreMegaModule,
} from './avos-media-core-mega/avos-media-core-mega.module';

import { AvosMediaDevelopmentMegaModule } from './avos-media-development-mega/avos-media-development-mega.module';
import { AvosMediaProductionMegaModule } from './avos-media-production-mega/avos-media-production-mega.module';

import { AvosMediaPublishingGrowthMegaModule } from './avos-media-publishing-growth-mega/avos-media-publishing-growth-mega.module';

import { AvosMediaMonetizationMegaModule } from './avos-media-monetization-mega/avos-media-monetization-mega.module';

import { AvosMediaIpFranchiseMegaModule } from './avos-media-ip-franchise-mega/avos-media-ip-franchise-mega.module';

import { AvosMediaGovernanceMegaModule } from './avos-media-governance-mega/avos-media-governance-mega.module';

import { AvosMediaIntelligenceMegaModule } from './avos-media-intelligence-mega/avos-media-intelligence-mega.module';

import { AvosMediaAiOrganizationMegaModule } from './avos-media-ai-organization-mega/avos-media-ai-organization-mega.module';

import { AvosMediaAutonomousLifecycleMegaModule } from './avos-media-autonomous-lifecycle-mega/avos-media-autonomous-lifecycle-mega.module';

import { AvosMediaGlobalExpansionMegaModule } from './avos-media-global-expansion-mega/avos-media-global-expansion-mega.module';

import { AvosMediaIpEmpireMegaModule } from './avos-media-ip-empire-mega/avos-media-ip-empire-mega.module';

import { CreativeMediaEcosystemMegaModule } from './creative-media-ecosystem-mega/creative-media-ecosystem-mega.module';

import { AvosMediaBusinessRevenueMegaModule } from './media-business-revenue-mega/avos-media-business-revenue-mega.module';

import { AvosMediaUltraEcosystemMegaModule } from './avos-media-ultra-ecosystem-mega/avos-media-ultra-ecosystem-mega.module';

@Module({
  imports: [
    MediaEnterprisePlatformModule,
    MediaIntelligencePlatformModule,
    MediaEmpireCommandModule,AvosMediaUltraEcosystemMegaModule,
    AvosMediaBusinessRevenueMegaModule,
    CreativeMediaEcosystemMegaModule,
    AvosMediaIpEmpireMegaModule,
    AvosMediaGlobalExpansionMegaModule,
    AvosMediaAutonomousLifecycleMegaModule,
    AvosMediaAiOrganizationMegaModule,
    AvosMediaIntelligenceMegaModule,
    AvosMediaGovernanceMegaModule,
    AvosMediaIpFranchiseMegaModule,
    AvosMediaMonetizationMegaModule,
    AvosMediaPublishingGrowthMegaModule,
    AvosMediaProductionMegaModule,
    AvosMediaDevelopmentMegaModule,AvosMediaCoreMegaModule],
  exports: [
    MediaEnterprisePlatformModule,
    MediaIntelligencePlatformModule,
    MediaEmpireCommandModule,AvosMediaUltraEcosystemMegaModule,
    AvosMediaBusinessRevenueMegaModule,
    CreativeMediaEcosystemMegaModule,
    AvosMediaIpEmpireMegaModule,
    AvosMediaGlobalExpansionMegaModule,
    AvosMediaAutonomousLifecycleMegaModule,
    AvosMediaAiOrganizationMegaModule,
    AvosMediaIntelligenceMegaModule,
    AvosMediaGovernanceMegaModule,
    AvosMediaIpFranchiseMegaModule,
    AvosMediaMonetizationMegaModule,
    AvosMediaPublishingGrowthMegaModule,
    AvosMediaProductionMegaModule,
    AvosMediaDevelopmentMegaModule,AvosMediaCoreMegaModule],
})
export class AvosMediaModule {}














