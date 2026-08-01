import { PersistenceModule } from './modules/persistence';
import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { ConfigModule } from './modules/config/config.module';
import { LoggingModule } from './modules/logging/logging.module';
import { CoreModule } from './modules/core/core.module';
import { CapabilityModule } from './modules/capabilities/capability.module';
import { DomainModule } from './modules/domains/domain.module';
import { RegistryModule } from './modules/registry/registry.module';
import { DependencyModule } from './modules/dependencies/dependency.module';
import { PlatformStatusModule } from './modules/platform-status/platform-status.module';
import { EventBusModule } from './modules/event-bus/event-bus.module';
import { KnowledgeModule } from './modules/knowledge/knowledge.module';
import { WorkflowModule } from './modules/workflow/workflow.module';
import { MessagingModule } from './modules/messaging/messaging.module';
import { RuntimeModule } from './modules/runtime/runtime.module';
import { BlueprintModule } from './modules/blueprint/blueprint.module';

import { ApiLayerModule } from './modules/api-layer/api-layer.module';
import { CreatorOsCoreV1Module } from './modules/core-v1/core-v1.module';
import { CreatorOsCoreV1CompletionModule } from './modules/core-v1-completion/core-v1-completion.module';

import { IdeaIntelligenceModule } from './modules/media/idea-intelligence/idea-intelligence.module';
import { MediaEcosystemModule } from './modules/youtube/media-ecosystem/media-ecosystem.module';
import { CreativeProductionModule } from './modules/youtube/creative-production/creative-production.module';
import { BrandIntelligenceModule } from './modules/youtube/brand-intelligence/brand-intelligence.module';
import { YoutubeOptimizationMegaModule } from './modules/youtube/youtube-optimization-mega/youtube-optimization-mega.module';
import { YoutubeOperationsMegaModule } from './modules/youtube/youtube-operations-mega/youtube-operations-mega.module';
import { YoutubeGrowthManagementMegaModule } from './modules/youtube/youtube-growth-management-mega/youtube-growth-management-mega.module';
import { YoutubeMonetizationMegaModule } from './modules/youtube/youtube-monetization-mega/youtube-monetization-mega.module';
import { YoutubeContentProductionMegaModule } from './modules/youtube/youtube-content-production-mega/youtube-content-production-mega.module';
import { YoutubeAudienceCommunityMegaModule } from './modules/youtube/youtube-audience-community-mega/youtube-audience-community-mega.module';
import { YoutubeBrandIpMegaModule } from './modules/youtube/youtube-brand-ip-mega/youtube-brand-ip-mega.module';
import { YoutubeAutomationOrchestrationMegaModule } from './modules/youtube/youtube-automation-orchestration-mega/youtube-automation-orchestration-mega.module';
import { YoutubeIntelligenceStrategyMegaModule } from './modules/youtube/youtube-intelligence-strategy-mega/youtube-intelligence-strategy-mega.module';
import { YoutubeGlobalExpansionMegaModule } from './modules/youtube/youtube-global-expansion-mega/youtube-global-expansion-mega.module';
import { AvosMediaModule } from './modules/media/avos-media.module';

@Module({
  imports: [
    AvosMediaModule,
    YoutubeGlobalExpansionMegaModule,
    YoutubeIntelligenceStrategyMegaModule,
    YoutubeAutomationOrchestrationMegaModule,
    YoutubeBrandIpMegaModule,
    YoutubeAudienceCommunityMegaModule,
    YoutubeContentProductionMegaModule,
    YoutubeMonetizationMegaModule,
    YoutubeGrowthManagementMegaModule,
    YoutubeOperationsMegaModule,
    YoutubeOptimizationMegaModule,
    CreativeProductionModule,
    IdeaIntelligenceModule,
    MediaEcosystemModule,
    CreatorOsCoreV1CompletionModule,
    CreatorOsCoreV1Module,
    ApiLayerModule,
    PersistenceModule,
    ConfigModule,
    LoggingModule,
    CoreModule,
    CapabilityModule,
    DomainModule,
    RegistryModule,
    DependencyModule,
    EventBusModule,
    KnowledgeModule,
    WorkflowModule,
    MessagingModule,
    RuntimeModule,
    BlueprintModule,
    PlatformStatusModule,
    BrandIntelligenceModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}
















