import { AiFoundationModule } from './enterprise/ai-foundation/ai-foundation.module';
import { EnterpriseFoundationModule } from "./enterprise-foundation/enterprise-foundation.module";
import { CreatorDashboardModule } from "./creator-dashboard/creator-dashboard.module";
import { FinalProductionModule } from './modules/final-production-mega-pack-e/final-production.module';
import { ExtensionOperationsModule } from './modules/extension-operations-mega-pack-d/extension-operations.module';
import { TrustSecurityModule } from './modules/trust-security-mega-pack-c/trust-security.module';
import { IntelligenceCoreModule } from './modules/intelligence-core-mega-pack-b/intelligence-core.module';
import { PlatformCoreModule } from './modules/platform-core-mega-pack-a/platform-core.module';
import { PlatformIntegrationModule } from './modules/platform-integration-mega-pack/platform-integration.module';
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
import { MediaResearchModule } from './avos/media-research/media-research.module';


import { AiContentModule } from './ai-content/ai-content.module';
import { IntelligenceModule } from './enterprise/intelligence/intelligence.module';

import { NoveltyGenerationModule } from './enterprise/intelligence/novelty-generation/novelty-generation.module';
import { InfiniteUniverseModule } from './enterprise/infinite-universe/infinite-universe.module';
import { SponsorshipIntelligenceModule } from "./enterprise/business-intelligence/sponsorship/sponsorship-intelligence.module";
import { SponsorshipBusinessIntelligenceModule } from "./enterprise/sponsorship-business-intelligence/sponsorship-business-intelligence.module";
import { AiStudioRuntimeModule } from "./enterprise/ai-studio-runtime";
import { AiOrganizationPersistenceModule } from "./enterprise/ai-organization-persistence";
import { AiTeamExecutionModule } from "./enterprise/ai-team-execution/ai-team-execution.module";
import {
  MonitoringDiagnosticsModule,
} from './modules/monitoring-diagnostics';
import {
  AuditEventTimelineModule,
} from './modules/audit-event-timeline';

import {
  LogsExplorerModule,
} from './modules/logs-explorer';

import {
  NotificationsFoundationModule,
} from './modules/notifications-foundation';

import {
  SchedulingJobsModule,
} from './modules/scheduling-jobs';
@Module({
  imports: [
    SchedulingJobsModule,
    NotificationsFoundationModule,
    LogsExplorerModule,
    AuditEventTimelineModule,
    MonitoringDiagnosticsModule,
    
    
    AiTeamExecutionModule,AiOrganizationPersistenceModule,AiStudioRuntimeModule,
    SponsorshipBusinessIntelligenceModule,
    SponsorshipIntelligenceModule,
    AiFoundationModule,
    IntelligenceModule,
    EnterpriseFoundationModule,CreatorDashboardModule,
    FinalProductionModule,
    ExtensionOperationsModule,
    TrustSecurityModule,
    IntelligenceCoreModule,
    PlatformCoreModule,
    PlatformIntegrationModule,
    AvosMediaModule,
    MediaResearchModule,
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
    AiContentModule,
    NoveltyGenerationModule,
    InfiniteUniverseModule,
  ],
  controllers: [
    AppController,
  ],
  providers: [],
})
export class AppModule {}

console.log("APP MODULE AI TEAM CHECK");

console.log("AI TEAM EXECUTION MODULE LOADED");

































