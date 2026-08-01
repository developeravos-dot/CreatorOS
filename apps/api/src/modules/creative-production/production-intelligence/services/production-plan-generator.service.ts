import { Injectable } from "@nestjs/common";

import {
    ContentAnalysisResult
} from "./content-analyzer.service";

import {
    AudienceAnalysisResult
} from "./audience-analyzer.service";

import {
    PlatformAnalysisResult
} from "./platform-intelligence.service";

import {
    ProductionStrategyResult
} from "./production-strategy.service";

export interface GeneratedProductionPlan {

    createdAt: Date;

    content: ContentAnalysisResult;

    audience: AudienceAnalysisResult;

    platform: PlatformAnalysisResult;

    strategy: ProductionStrategyResult;
}

@Injectable()
export class ProductionPlanGeneratorService {

    generate(

        content: ContentAnalysisResult,

        audience: AudienceAnalysisResult,

        platform: PlatformAnalysisResult,

        strategy: ProductionStrategyResult

    ): GeneratedProductionPlan {

        return {

            createdAt: new Date(),

            content,

            audience,

            platform,

            strategy
        };
    }
}
