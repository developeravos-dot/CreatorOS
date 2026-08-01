import {
    Body,
    Controller,
    HttpCode,
    HttpStatus,
    Post
} from "@nestjs/common";

import { AnalyzeContentDto } from "../dto/analyze-content.dto";

import { ProductionIntelligenceService } from "../services/production-intelligence.service";

@Controller("creative-production")
export class ProductionIntelligenceController {

    constructor(

        private readonly service:
            ProductionIntelligenceService

    ) {}

    @Post("analyze")
    @HttpCode(HttpStatus.OK)
    analyze(
        @Body() dto: AnalyzeContentDto
    ) {

        return this.service.analyze(dto);
    }
}
