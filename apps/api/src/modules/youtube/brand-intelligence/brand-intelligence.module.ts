import { Module } from '@nestjs/common';

import { BrandIntelligenceController } from './brand-intelligence.controller';
import { BrandIntelligenceService } from './brand-intelligence.service';

@Module({
  controllers: [BrandIntelligenceController],
  providers: [BrandIntelligenceService],
  exports: [BrandIntelligenceService],
})
export class BrandIntelligenceModule {}
