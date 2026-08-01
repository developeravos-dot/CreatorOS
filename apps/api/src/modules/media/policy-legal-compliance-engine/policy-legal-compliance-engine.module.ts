import { Module } from '@nestjs/common';

import {
  PolicyLegalComplianceEngineController,
} from './policy-legal-compliance-engine.controller';

import {
  PolicyLegalComplianceEngineService,
} from './policy-legal-compliance-engine.service';

@Module({
  controllers: [PolicyLegalComplianceEngineController],
  providers: [PolicyLegalComplianceEngineService],
  exports: [PolicyLegalComplianceEngineService],
})
export class PolicyLegalComplianceEngineModule {}
