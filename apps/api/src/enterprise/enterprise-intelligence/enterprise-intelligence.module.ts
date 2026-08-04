import {
  Module,
} from '@nestjs/common';

import {
  EnterpriseIntelligenceController,
} from './controllers';
import {
  EnterpriseDecisionEngineService,
  EnterpriseIntelligenceOrchestratorService,
  EnterprisePredictionEngineService,
  EnterpriseRiskIntelligenceService,
  EnterpriseStrategyEngineService,
} from './services';

const ENTERPRISE_INTELLIGENCE_PROVIDERS = [
  EnterprisePredictionEngineService,
  EnterpriseRiskIntelligenceService,
  EnterpriseStrategyEngineService,
  EnterpriseDecisionEngineService,
  EnterpriseIntelligenceOrchestratorService,
] as const;

@Module({
  controllers: [
    EnterpriseIntelligenceController,
  ],
  providers: [
    ...ENTERPRISE_INTELLIGENCE_PROVIDERS,
  ],
  exports: [
    ...ENTERPRISE_INTELLIGENCE_PROVIDERS,
  ],
})
export class EnterpriseIntelligenceModule {}
