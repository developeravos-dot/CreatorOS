import { Module } from "@nestjs/common";

import { SponsorshipBusinessIntelligenceController } from "./controllers/sponsorship-business-intelligence.controller";

import { PersistenceModule } from "../../modules/persistence";

import { BrandMatchEngineModule } from "./engines/BrandMatchEngine/brand-match-engine.module";
import { SponsorDiscoveryEngineModule } from "./engines/SponsorDiscoveryEngine/sponsor-discovery-engine.module";

import { SponsorRepository } from "./repositories/sponsor.repository";
import { BrandRepository } from "./repositories/brand.repository";
import { SponsorshipOpportunityRepository } from "./repositories/sponsorship-opportunity.repository";
import { SponsorshipProposalRepository } from "./repositories/sponsorship-proposal.repository";
import { SponsorshipCampaignRepository } from "./repositories/sponsorship-campaign.repository";
import { SponsorInteractionRepository } from "./repositories/sponsor-interaction.repository";
import { SponsorCrmRepository } from "./repositories/sponsor-crm.repository";

import { SponsorCrmService } from "./services/sponsor-crm.service";
import { SponsorshipDashboardSummaryService } from "./services/sponsorship-dashboard-summary.service";
import { ProposalGenerationService } from "./services/proposal-generation.service";
import { SponsorshipCampaignService } from "./services/sponsorship-campaign.service";

@Module({
  imports: [
    PersistenceModule,
    BrandMatchEngineModule,
    SponsorDiscoveryEngineModule,
  ],

  controllers: [SponsorshipBusinessIntelligenceController],

  providers: [
    SponsorRepository,
    BrandRepository,
    SponsorshipOpportunityRepository,
    SponsorshipProposalRepository,
    SponsorshipCampaignRepository,
    SponsorInteractionRepository,
    SponsorCrmRepository,

    SponsorCrmService,
    SponsorshipDashboardSummaryService,
    ProposalGenerationService,
    SponsorshipCampaignService,
  ],

  exports: [
    SponsorCrmService,
    SponsorshipDashboardSummaryService,
    ProposalGenerationService,
    SponsorshipCampaignService,
  ],
})
export class SponsorshipBusinessIntelligenceModule {}


