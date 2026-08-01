import { Module } from "@nestjs/common";

import {
    ProductionIntelligenceController
} from "./controllers/production-intelligence.controller";

import {
    ProductionIntelligenceService
} from "./services/production-intelligence.service";

import {
    ContentAnalyzerService
} from "./services/content-analyzer.service";

import {
    AudienceAnalyzerService
} from "./services/audience-analyzer.service";

import {
    PlatformIntelligenceService
} from "./services/platform-intelligence.service";

import {
    ProductionStrategyService
} from "./services/production-strategy.service";

import {
    ProductionPlanGeneratorService
} from "./services/production-plan-generator.service";

@Module({

    controllers: [

        ProductionIntelligenceController
    ],

    providers: [

        ProductionIntelligenceService,

        ContentAnalyzerService,

        AudienceAnalyzerService,

        PlatformIntelligenceService,

        ProductionStrategyService,

        ProductionPlanGeneratorService
    ],

    exports: [

        ProductionIntelligenceService
    ]
})
export class ProductionIntelligenceModule {}
