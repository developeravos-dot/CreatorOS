import { Module } from '@nestjs/common';

import {
  ContentTrustSafetyEngineModule,
} from '../content-trust-safety-engine/content-trust-safety-engine.module';

import {
  PolicyLegalComplianceEngineModule,
} from '../policy-legal-compliance-engine/policy-legal-compliance-engine.module';

import {
  PrivacyCopyrightGovernanceEngineModule,
} from '../privacy-copyright-governance-engine/privacy-copyright-governance-engine.module';

import {
  MediaRiskIncidentEngineModule,
} from '../media-risk-incident-engine/media-risk-incident-engine.module';

import {
  GovernanceAuditAuthorityEngineModule,
} from '../governance-audit-authority-engine/governance-audit-authority-engine.module';

@Module({
  imports: [
    ContentTrustSafetyEngineModule,
    PolicyLegalComplianceEngineModule,
    PrivacyCopyrightGovernanceEngineModule,
    MediaRiskIncidentEngineModule,
    GovernanceAuditAuthorityEngineModule,
  ],
  exports: [
    ContentTrustSafetyEngineModule,
    PolicyLegalComplianceEngineModule,
    PrivacyCopyrightGovernanceEngineModule,
    MediaRiskIncidentEngineModule,
    GovernanceAuditAuthorityEngineModule,
  ],
})
export class AvosMediaGovernanceMegaModule {}
