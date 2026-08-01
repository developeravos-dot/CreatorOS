import { Module } from '@nestjs/common';
import { IntelligenceController } from './intelligence.controller';
import { IntelligenceRouterService } from './intelligence-router.service';
import { IntelligenceCostGateService } from './intelligence-cost-gate.service';
import { LocalIntelligenceProvider } from './providers/local-intelligence.provider';
import { OpenAiIntelligenceProvider } from './providers/openai-intelligence.provider';
import { MockIntelligenceProvider } from './providers/mock-intelligence.provider';

@Module({
  controllers: [IntelligenceController],
  providers: [
    IntelligenceRouterService,
    IntelligenceCostGateService,
    LocalIntelligenceProvider,
    OpenAiIntelligenceProvider,
    MockIntelligenceProvider,
  ],
  exports: [
    IntelligenceRouterService,
    IntelligenceCostGateService,
  ],
})
export class IntelligenceModule {}
