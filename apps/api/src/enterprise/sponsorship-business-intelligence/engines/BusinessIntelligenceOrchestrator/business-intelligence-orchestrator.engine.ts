import { Injectable } from "@nestjs/common";

import { BrandMatchEngine } from "../BrandMatchEngine/brand-match.engine";
import { SponsorDiscoveryEngine } from "../SponsorDiscoveryEngine/sponsor-discovery.engine";

@Injectable()
export class BusinessIntelligenceOrchestrator {

  constructor(
    private readonly sponsorDiscovery: SponsorDiscoveryEngine,
    private readonly brandMatch: BrandMatchEngine,
  ) {}

  getOverview() {

    const sponsors =
      this.sponsorDiscovery.discover();

    return {

      discoveredSponsors: sponsors.length,

      topSponsors: sponsors.slice(0,5),

      systemStatus: "operational",

      capabilities: {

        sponsorDiscovery: true,

        brandMatching: true,

        proposalGeneration: false,

        crm: false,

        revenueIntelligence: false,

        aiCouncil: false,

      },

    };

  }

}
