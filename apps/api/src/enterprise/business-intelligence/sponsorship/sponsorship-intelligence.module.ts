import { Module } from '@nestjs/common';
import { SponsorshipCampaignAnalyticsModule } from './analytics/sponsorship-campaign-analytics.module';
import { SponsorshipIntelligenceController } from './controllers/sponsorship-intelligence.controller';
import { SponsorshipOutreachController } from './controllers/sponsorship-outreach.controller';
import { SponsorshipCampaignAnalyticsController } from './analytics/controllers/sponsorship-campaign-analytics.controller';
import { SponsorshipCrmController } from './crm/controllers/sponsorship-crm.controller';
import { SponsorshipNegotiationController } from './negotiation/controllers/sponsorship-negotiation.controller';
import { SponsorshipDiscoveryController } from './discovery/controllers/sponsorship-discovery.controller';
import { SponsorshipOrchestratorController } from './orchestrator/controllers/sponsorship-orchestrator.controller';
import { SponsorshipIntegrationController } from './integration/controllers/sponsorship-integration.controller';
import { SponsorshipWorkflowController } from './workflow/controllers/sponsorship-workflow.controller';
import { SponsorshipLeadQualificationEngine } from './engines/sponsorship-lead-qualification.engine';
import { SponsorshipMatchingEngine } from './engines/sponsorship-matching.engine';
import { SponsorshipOutreachGenerationEngine } from './engines/sponsorship-outreach-generation.engine';
import { SponsorshipPricingEngine } from './engines/sponsorship-pricing.engine';
import { SponsorshipStrategyEngine } from './engines/sponsorship-strategy.engine';
import { SponsorshipOutreachRepository } from './repositories/sponsorship-outreach.repository';
import { SponsorshipRepository } from './repositories/sponsorship.repository';
import { SponsorshipIntelligenceService } from './services/sponsorship-intelligence.service';
import { SponsorshipOutreachService } from './services/sponsorship-outreach.service';
import { SponsorshipCampaignAnalyticsService } from './analytics/services/sponsorship-campaign-analytics.service';
import { SponsorshipCrmService } from './crm/services/sponsorship-crm.service';
import { SponsorshipNegotiationService } from './negotiation/services/sponsorship-negotiation.service';
import { SponsorshipDiscoveryService } from './discovery/services/sponsorship-discovery.service';
import { SponsorshipOrchestratorService } from './orchestrator/services/sponsorship-orchestrator.service';
import { SponsorshipIntegrationService } from './integration/services/sponsorship-integration.service';
import { SponsorshipWorkflowService } from './workflow/services/sponsorship-workflow.service';

import { SponsorshipDealController } from './controllers/sponsorship-deal.controller';
import { SponsorshipDealRepository } from './repositories/sponsorship-deal.repository';
import { SponsorshipDealService } from './services/sponsorship-deal.service';
@Module({
  controllers: [
    SponsorshipCampaignAnalyticsController,
    SponsorshipCrmController,
    SponsorshipNegotiationController,
    SponsorshipDiscoveryController,
    SponsorshipOrchestratorController,
    SponsorshipIntegrationController,
    SponsorshipWorkflowController,
    SponsorshipDealController,
    SponsorshipIntelligenceController,
    SponsorshipOutreachController,
  ],
  providers: [
    SponsorshipCampaignAnalyticsService,
    SponsorshipCrmService,
    SponsorshipNegotiationService,
    SponsorshipDiscoveryService,
    SponsorshipOrchestratorService,
    SponsorshipIntegrationService,
    SponsorshipWorkflowService,
    SponsorshipDealService,
    SponsorshipDealRepository,
    SponsorshipIntelligenceService,
    SponsorshipOutreachService,
    SponsorshipMatchingEngine,
    SponsorshipPricingEngine,
    SponsorshipStrategyEngine,
    SponsorshipLeadQualificationEngine,
    SponsorshipOutreachGenerationEngine,
    SponsorshipRepository,
    SponsorshipOutreachRepository,
  ],
  exports: [
    SponsorshipCampaignAnalyticsService,
    SponsorshipCrmService,
    SponsorshipNegotiationService,
    SponsorshipDiscoveryService,
    SponsorshipOrchestratorService,
    SponsorshipIntegrationService,
    SponsorshipWorkflowService,
    SponsorshipDealService,
    SponsorshipIntelligenceService,
    SponsorshipOutreachService,
    SponsorshipMatchingEngine,
    SponsorshipPricingEngine,
    SponsorshipStrategyEngine,
    SponsorshipLeadQualificationEngine,
    SponsorshipOutreachGenerationEngine,
  ],
})
export class SponsorshipIntelligenceModule {}









