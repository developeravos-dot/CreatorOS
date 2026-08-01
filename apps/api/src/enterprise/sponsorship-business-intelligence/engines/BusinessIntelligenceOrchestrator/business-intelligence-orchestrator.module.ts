import { Module } from "@nestjs/common";

import { BrandMatchEngineModule } from "../BrandMatchEngine/brand-match-engine.module";
import { SponsorDiscoveryEngineModule } from "../SponsorDiscoveryEngine/sponsor-discovery-engine.module";

import { BusinessIntelligenceOrchestrator } from "./business-intelligence-orchestrator.engine";

@Module({

  imports: [

    BrandMatchEngineModule,

    SponsorDiscoveryEngineModule,

  ],

  providers: [

    BusinessIntelligenceOrchestrator,

  ],

  exports: [

    BusinessIntelligenceOrchestrator,

  ],

})
export class BusinessIntelligenceOrchestratorModule {}
