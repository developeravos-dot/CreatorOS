import { Injectable } from "@nestjs/common";

import { AnalyzeContentDto } from "../dto/analyze-content.dto";

import { ContentAnalyzerService } from "./content-analyzer.service";
import { AudienceAnalyzerService } from "./audience-analyzer.service";
import { PlatformIntelligenceService } from "./platform-intelligence.service";
import { ProductionStrategyService } from "./production-strategy.service";

import {
    GeneratedProductionPlan,
    ProductionPlanGeneratorService
} from "./production-plan-generator.service";

@Injectable()
export class ProductionIntelligenceService {

    constructor(

        private readonly contentAnalyzer:
            ContentAnalyzerService,

        private readonly audienceAnalyzer:
            AudienceAnalyzerService,

        private readonly platformAnalyzer:
            PlatformIntelligenceService,

        private readonly strategyEngine:
            ProductionStrategyService,

        private readonly planGenerator:
            ProductionPlanGeneratorService

    ) {}

    analyze(
        dto: AnalyzeContentDto
    ): GeneratedProductionPlan {

        const content =
            this.contentAnalyzer.analyze(dto);

        const audience =
            this.audienceAnalyzer.analyze(
                content.category
            );

        const platform =
            this.platformAnalyzer.analyze(
                dto.platform ?? "YouTube"
            );

        const strategy =
            this.strategyEngine.build(
                content.category
            );

        return this.planGenerator.generate(

            content,

            audience,

            platform,

            strategy
        );
    }
}
