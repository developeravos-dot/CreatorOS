import { Module } from '@nestjs/common';
import { AutonomousGrowthEngineService } from './autonomous-growth-engine.service';
import { ContentInvestmentEngineService } from './content-investment-engine.service';
import { MediaGrowthOpportunityPlatformController } from './media-growth-opportunity-platform.controller';
import { MediaGrowthOpportunityPlatformService } from './media-growth-opportunity-platform.service';
import { OpportunityRadarService } from './opportunity-radar.service';

@Module({
  controllers: [MediaGrowthOpportunityPlatformController],
  providers: [
    MediaGrowthOpportunityPlatformService,
    OpportunityRadarService,
    ContentInvestmentEngineService,
    AutonomousGrowthEngineService,
  ],
  exports: [MediaGrowthOpportunityPlatformService],
})
export class MediaGrowthOpportunityPlatformModule {}